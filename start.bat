@echo off
REM RiskRadar v2 - Windows Startup Script

echo ╔═══════════════════════════════════════════════════════╗
echo ║                                                       ║
echo ║           🛰️  RiskRadar v2.0.0                       ║
echo ║                                                       ║
echo ║   Startup Risk Intelligence Platform                 ║
echo ║                                                       ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

REM Check for Docker
where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    where docker-compose >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo 🐳 Docker detected. Would you like to use Docker? (y/n^)
        set /p use_docker=
        if /i "%use_docker%"=="y" (
            echo.
            echo 🚀 Starting services with Docker Compose...
            docker-compose up --build
            exit /b 0
        )
    )
)

echo.
echo 📦 Starting local development environment...
echo.

REM Check if backend venv exists
if not exist "backend\venv" (
    echo ⚙️  Setting up Python virtual environment...
    cd backend
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
    cd ..
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo ⚙️  Installing frontend dependencies...
    call pnpm install
)

REM Create .env files if they don't exist
if not exist "backend\.env" (
    echo 📝 Creating backend .env file...
    copy backend\.env.example backend\.env
)

if not exist ".env.local" (
    echo 📝 Creating frontend .env.local file...
    copy .env.local.example .env.local
)

echo.
echo ✅ Setup complete!
echo.
echo 🚀 Starting services...
echo.

REM Start backend
echo 🔧 Starting backend on http://localhost:8000...
cd backend
start "RiskRadar Backend" cmd /k "venv\Scripts\activate.bat && python run.py"
cd ..

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo 🎨 Starting frontend on http://localhost:3000...
start "RiskRadar Frontend" cmd /k "pnpm dev"

echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║                                                       ║
echo ║  ✅ RiskRadar is running!                            ║
echo ║                                                       ║
echo ║  Frontend:  http://localhost:3000                    ║
echo ║  Backend:   http://localhost:8000                    ║
echo ║  API Docs:  http://localhost:8000/api/docs           ║
echo ║                                                       ║
echo ║  Close the terminal windows to stop services         ║
echo ║                                                       ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

pause
