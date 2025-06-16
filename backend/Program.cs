using DotNetEnv;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Carga las variables de entorno desde el .env
DotNetEnv.Env.Load();

// Servicios de la app
builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddEndpointsApiExplorer(); // Necesario para Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ZYUZ API", Version = "v1" });
});

// CORS: habilita llamadas desde el frontend en React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Cambiar al puerto real del frontend React
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Middleware
app.UseCors("AllowReactApp");

//Configuracion de Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ZYUZ API");
        //c.RoutePrefix = "swagger";
    });
}

app.MapControllers();

app.Run();