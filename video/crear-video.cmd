@echo off
chcp 65001 >nul
title Crear video - Sentido Aracnido
cd /d "%~dp0.."
node video\crear-video.js %*
echo.
pause
