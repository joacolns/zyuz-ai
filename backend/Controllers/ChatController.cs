using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace backend.Controllers
{
    [ApiController]
    [Route("/api/chat")]
    public class ChatController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public ChatController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ChatRequest request)
        {
            if(request == null || string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest("El mensaje no puede estar vacio.");
            }

            var apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
            if (string.IsNullOrEmpty(apiKey))
            {
                return StatusCode(500, "Falta la variable de entorno OPENAI_API_KEY.");
            }

            var endpoint = _configuration["OpenAI:Endpoint"];
            var model = _configuration["OpenAI:Model"];

            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey); //Settings de los headers         
            
            var payload = new //Cuerpo de mensaje
            {
                model = model,
                messages = new[]
                {
                    new { role = "user", content = request.Message }
                }
            };

            var jsonPayload = JsonSerializer.Serialize(payload); //Conversion del payload a json
            var httpContent = new StringContent(jsonPayload, Encoding.UTF8, "application/json"); //Preparar el contenido HTTP

            var response = await client.PostAsync(endpoint, httpContent); //Envia la solicitud HTTP

            var responseJson = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, new { error = "Error desde OpenAI", detalles = responseJson });
            }

            return Content(responseJson, "application/json");
        }

        public class ChatRequest
        {
            public string Message { get; set; } = string.Empty;
        }

    }
}
