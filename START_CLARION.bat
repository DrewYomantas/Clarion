@echo off
setlocal

REM ============================================================
REM  Clarion Operator Launcher
REM  Double-click to start the backend and open the app.
REM
REM  After login, navigate to:
REM    http://localhost:5000/internal/command-center/
REM  (requires founder@clarionhq.co or any is_admin=1 account)
REM ============================================================

echo [clarion] Starting backend...
start "Clarion Backend" cmd /k "cd /d "%~dp0backend" && call start.bat"

REM Wait for Flask to boot before opening browser
timeout /t 5 /nobreak >nul

echo [clarion] Opening login page...
start "" "http://localhost:5000/login"

echo.
echo [clarion] Backend window is running. Close it to stop the server.
echo [clarion] After login go to: http://localhost:5000/internal/command-center/
endlocal
