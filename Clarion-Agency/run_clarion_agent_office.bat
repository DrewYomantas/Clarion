@echo off
cd /d "%~dp0"
echo.
echo ============================================================
echo   Clarion Agent Office — Pre-Launch Run
echo ============================================================
echo.

REM Check Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo   ERROR: Python not found.
    echo   Install Python 3.10+ and make sure it is on your PATH.
    echo.
    pause
    exit /b 1
)

echo   Starting pre-launch divisions...
echo   This takes 2-5 minutes depending on API response time.
echo.

python run_clarion_agent_office.py

if errorlevel 1 (
    echo.
    echo ============================================================
    echo   Something went wrong. Check the output above.
    echo   If the API key is missing, check Clarion-Agency\.env
    echo ============================================================
) else (
    echo.
    echo ============================================================
    echo   Done.
    echo   Open this file to read the brief:
    echo   reports\executive_brief_latest.md
    echo ============================================================
)

echo.
pause
