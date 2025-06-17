@echo off
echo ===================================
echo Instalando dependencias del proyecto
echo ===================================

echo.
echo === Verificando requisitos ===

:: Verificar si dotnet está instalado
where dotnet >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: No se encontró dotnet CLI. Por favor instale .NET SDK desde https://dotnet.microsoft.com/download
    pause
    exit /b 1
)

:: Verificar si npm está instalado
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: No se encontró npm. Por favor instale Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo === Instalando paquetes del backend ===
cd backend

:: Restaurar paquetes NuGet
echo Instalando paquetes NuGet...
dotnet restore

:: Instalar paquetes específicos para el proyecto
echo Instalando paquetes específicos...
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package MySql.Data.EntityFrameworkCore
dotnet add package MySql.Data
dotnet add package BCrypt.Net-Next
dotnet add package DotNetEnv
dotnet add package System.IdentityModel.Tokens.Jwt

echo.
echo === Instalando paquetes del frontend ===
cd ../frontend

:: Instalar dependencias de npm
echo Instalando paquetes npm...
call npm install

echo.
echo === Instalación completada ===
echo Para iniciar el backend: cd backend && dotnet run
echo Para iniciar el frontend: cd frontend && npm run dev

cd ..
pause