@echo off
:: ============================================================
:: Clarion Backend - Windows Development Launcher
:: Always uses venv312\Scripts\python.exe explicitly.
:: DO NOT replace with bare "python" or "py" — the system
:: Python 3.14 does not have project dependencies installed.
:: ============================================================

setlocal

set "SCRIPT_DIR=%~dp0"
set "VENV_PYTHON=%SCRIPT_DIR%venv312\Scripts\python.exe"
set "VENV_PIP=%SCRIPT_DIR%venv312\Scripts\pip.exe"

echo [clarion] Checking virtual environment...

if not exist "%VENV_PYTHON%" (
    echo [ERROR] venv312 not found at %VENV_PYTHON%
    echo         Run: python -m venv venv312 ^&^& venv312\Scripts\pip install -r requirements.txt
    exit /b 1
)

:: Verify dotenv is installed as a quick dependency check
"%VENV_PYTHON%" -c "import dotenv" 2>nul
if errorlevel 1 (
    echo [ERROR] python-dotenv not found in venv312. Installing requirements...
    "%VENV_PIP%" install -r "%SCRIPT_DIR%requirements.txt"
    if errorlevel 1 (
        echo [ERROR] pip install failed. Fix requirements.txt errors and retry.
        exit /b 1
    )
)

echo [clarion] Python  : %VENV_PYTHON%
echo [clarion] Starting app.py ...
echo.

cd /d "%SCRIPT_DIR%"
"%VENV_PYTHON%" app.py

endlocal
