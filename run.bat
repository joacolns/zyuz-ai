@echo off
title Zyuz AI - Backend + Frontend

echo Iniciando el backend...
start cmd /k "cd backend && dotnet run"

timeout /t 2 /nobreak >nul

echo Iniciando el frontend...
start cmd /k "cd frontend && npm run dev"

echo Ambos servidores han sido lanzados.
