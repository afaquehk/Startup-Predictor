"""
RiskRadar Backend - Run Script
"""

import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    
    print(f"""
    ╔═══════════════════════════════════════════════════════╗
    ║                                                       ║
    ║           🛰️  RiskRadar API v2.0.0                   ║
    ║                                                       ║
    ║   Startup Risk Intelligence Platform                 ║
    ║                                                       ║
    ╚═══════════════════════════════════════════════════════╝
    
    🚀 Starting server...
    📍 Host: {host}
    🔌 Port: {port}
    📚 Docs: http://localhost:{port}/api/docs
    🔄 Auto-reload: Enabled
    
    """)
    
    uvicorn.run(
        "src.main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )
