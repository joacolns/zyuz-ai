FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["*.csproj", "./"]
RUN dotnet restore

COPY . .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Establece el entorno de ASP.NET Core a Desarrollo para Swagger y otros servicios de desarrollo
ENV ASPNETCORE_ENVIRONMENT=Development

# ENV ASPNETCORE_ENVIRONMENT=Production #Cambia a Producción para el entorno de producción

ENV ASPNETCORE_URLS="http://+:5169;https://+:7106"

# Datos de base de datos para la conexión (estas son locales)
ENV ConnectionStrings__DefaultConnection="Server=host.docker.internal;Database=zyuz_database_local;User=root;Password=2634;"

ENV ASPNETCORE_HTTPS_PORT=7106
ENV ASPNETCORE_Kestrel__Certificates__Default__Password="contraseña"
ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/https/aspnetapp.pfx

EXPOSE 5169 7106

ENTRYPOINT ["dotnet", "backend.dll"]