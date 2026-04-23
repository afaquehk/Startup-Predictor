#!/bin/bash

# RiskRadar v2 - Startup Script
# This script starts both backend and frontend services

echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║           🛰️  RiskRadar v2.0.0                       ║"
echo "║                                                       ║"
echo "║   Startup Risk Intelligence Platform                 ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Check if Docker is available
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "🐳 Docker detected. Would you like to use Docker? (y/n)"
    read -r use_docker
    
    if [ "$use_docker" = "y" ] || [ "$use_docker" = "Y" ]; then
        echo ""
        echo "🚀 Starting services with Docker Compose..."
        docker-compose up --build
        exit 0
    fi
fi

# Local development setup
echo ""
echo "📦 Starting local development environment..."
echo ""

# Check if backend dependencies are installed
if [ ! -d "backend/venv" ]; then
    echo "⚙️  Setting up Python virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "⚙️  Installing frontend dependencies..."
    pnpm install
fi

# Create .env files if they don't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env
fi

if [ ! -f ".env.local" ]; then
    echo "📝 Creating frontend .env.local file..."
    cp .env.local.example .env.local
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting services..."
echo ""

# Start backend in background
echo "🔧 Starting backend on http://localhost:8000..."
cd backend
source venv/bin/activate
python run.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend on http://localhost:3000..."
pnpm dev &
FRONTEND_PID=$!

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║  ✅ RiskRadar is running!                            ║"
echo "║                                                       ║"
echo "║  Frontend:  http://localhost:3000                    ║"
echo "║  Backend:   http://localhost:8000                    ║"
echo "║  API Docs:  http://localhost:8000/api/docs           ║"
echo "║                                                       ║"
echo "║  Press Ctrl+C to stop all services                   ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo '👋 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit 0" INT
wait
