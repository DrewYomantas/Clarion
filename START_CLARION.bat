@echo off
setlocal

REM ============================================================
REM  Clarion Operator Launcher
REM  Double-click this to start the backend and open the app.
REM ============================================================

echo [clarion] Starting backend...
start "Clarion Backend" cmd /k "cd /d "%~dp0backend" && call start.bat"

REM Wait for Flask to boot before opening browser
timeout /t 5 /nobreak >nul

echo [clarion] Opening Command Center...
start "" "http://localhost:5000/internal/command-center/"

echo.
echo [clarion] Backend window is running. Close it to stop the server.
endlocal
