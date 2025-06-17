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
            if (request == null || request.messages == null || !request.messages.Any())
            {
                return BadRequest("No hay mensajes para procesar.");
            }

            var apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
            if (string.IsNullOrEmpty(apiKey))
            {
                return StatusCode(500, "Falta la variable de entorno OPENAI_API_KEY.");
            }

            var endpoint = _configuration["OpenAI:Endpoint"];
            var model = _configuration["OpenAI:Model"];

            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var payload = new
            {
                model = model,
                messages = request.messages,
                temperature = 0.7
            };

            var jsonPayload = JsonSerializer.Serialize(payload);
            var httpContent = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            var response = await client.PostAsync(endpoint, httpContent);
            var responseJson = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, new { error = "Error desde OpenAI", detalles = responseJson });
            }

            return Content(responseJson, "application/json");
        }


        public class ChatMessage
        {
            public string role { get; set; } = "";
            public string content { get; set; } = "";
        }

        public class ChatRequest
        {
            public List<ChatMessage> messages { get; set; } = new();
        }



    }
}
