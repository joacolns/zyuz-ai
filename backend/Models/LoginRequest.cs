namespace backend.Models
{
    public class LoginRequest //Representa los datos que el cliente envía al hacer una petición de login
    {
        public string User {  get; set; }
        public string Password { get; set; }
    }
}
