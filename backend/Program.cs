using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

DotNetEnv.Env.Load(); //Carga las variables de entorno

builder.Services.AddControllers(); //Agrega los controladores
builder.Services.AddHttpClient(); //Agrega los httpclient dentro de los controladores

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") //TODO: Cambiar a la URL del frontend React
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowReactApp");
app.MapControllers();

app.Run();
