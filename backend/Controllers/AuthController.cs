using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace backend.Controllers
{

    [ApiController]
    [Route("/api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly string _connectionString;

        public AuthController(IConfiguration config)
        {
            _config = config;
            _connectionString = _config.GetConnectionString("DefaultConnection");

            DotNetEnv.Env.Load();
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            using var connection = new MySqlConnection(_connectionString);
            connection.Open();

            var query = "SELECT id, user, email FROM users WHERE user = @user AND password = @password";

            using var command = new MySqlCommand(query, connection);
            command.Parameters.AddWithValue("@user", request.User);
            command.Parameters.AddWithValue("@password", HashPassword(request.Password));

            using var reader = command.ExecuteReader();

            if (reader.Read())
            {
                var user = new User
                {
                    Id = reader.GetInt32("id"),
                    Username = reader.GetString("user"),
                    Email = reader.GetString("email")
                };

                var token = GenerateJwtToken(user);

                return Ok(new AuthResponse
                {
                    Success = true,
                    Token = token,
                    User = user,
                    Message = "Login exitoso"
                });
            }

            return Unauthorized(new AuthResponse
            {
                Success = false,
                Message = "Credenciales incorrectas"
            });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            try
            {
                using var connection = new MySqlConnection(_connectionString);
                connection.Open();

                // Verificar si el usuario ya existe
                var checkQuery = "SELECT COUNT(*) FROM users WHERE user = @user OR email = @email";
                using var checkCommand = new MySqlCommand(checkQuery, connection);
                checkCommand.Parameters.AddWithValue("@user", request.Username);
                checkCommand.Parameters.AddWithValue("@email", request.Email);

                var exists = Convert.ToInt32(checkCommand.ExecuteScalar()) > 0;

                if (exists)
                {
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Message = "El usuario o email ya está registrado"
                    });
                }

                // Crear nuevo usuario
                var insertQuery = @"INSERT INTO users (user, email, password) 
                                  VALUES (@user, @email, @password);
                                  SELECT LAST_INSERT_ID();";

                using var insertCommand = new MySqlCommand(insertQuery, connection);
                insertCommand.Parameters.AddWithValue("@user", request.Username);
                insertCommand.Parameters.AddWithValue("@email", request.Email);
                insertCommand.Parameters.AddWithValue("@password", HashPassword(request.Password));

                var userId = Convert.ToInt32(insertCommand.ExecuteScalar());

                // Obtener el usuario creado
                var userQuery = "SELECT id, user, email FROM users WHERE id = @id";
                using var userCommand = new MySqlCommand(userQuery, connection);
                userCommand.Parameters.AddWithValue("@id", userId);

                using var reader = userCommand.ExecuteReader();
                reader.Read();

                var user = new User
                {
                    Id = userId,
                    Username = reader.GetString("user"),
                    Email = reader.GetString("email")
                };

                var token = GenerateJwtToken(user);

                return Ok(new AuthResponse
                {
                    Success = true,
                    Token = token,
                    User = user,
                    Message = "Registro exitoso"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new AuthResponse
                {
                    Success = false,
                    Message = $"Error interno: {ex.Message}"
                });
            }
        }

        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_KEY")));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("id", user.Id.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }
}