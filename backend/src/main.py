"""
RiskRadar v2 - FastAPI Backend
Main API server with 8 endpoints for startup risk intelligence
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
import logging

from .services.ml_service import MLService
from .services.enrichment_service import EnrichmentService
from .services.github_service import GitHubService
from .services.news_service import NewsService
from .services.stock_service import StockService
from .services.dataset_service import DatasetService

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="RiskRadar API",
    description="AI-powered startup risk intelligence platform",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS configuration
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
ml_service = MLService()
enrichment_service = EnrichmentService()
github_service = GitHubService()
news_service = NewsService()
stock_service = StockService()
dataset_service = DatasetService()

# ============================================================================
# Pydantic Models
# ============================================================================

class StartupLookupRequest(BaseModel):
    name: str = Field(..., description="Startup name to search for")
    fuzzy: bool = Field(default=True, description="Enable fuzzy matching")

class EnrichmentRequest(BaseModel):
    name: str = Field(..., description="Startup name")
    website: Optional[str] = Field(None, description="Company website URL")
    
class PredictRequest(BaseModel):
    startup_data: Dict[str, Any] = Field(..., description="Startup features for prediction")

class ComparablesRequest(BaseModel):
    sector: str = Field(..., description="Industry sector")
    stage: Optional[str] = Field(None, description="Funding stage")
    limit: int = Field(default=10, description="Number of results")

# ============================================================================
# API Endpoints
# ============================================================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "RiskRadar API",
        "version": "2.0.0",
        "status": "operational",
        "endpoints": {
            "docs": "/api/docs",
            "health": "/api/health"
        }
    }

@app.get("/api/health")
async def health_check():
    """Detailed health check with service status"""
    return {
        "status": "healthy",
        "services": {
            "ml_model": ml_service.is_ready(),
            "dataset": dataset_service.is_ready(),
            "github": github_service.is_ready(),
            "news": news_service.is_ready(),
            "stock": stock_service.is_ready()
        }
    }

@app.get("/api/startups/suggest")
async def suggest_startups(
    query: str = Query(..., min_length=1, description="Search query"),
    limit: int = Query(default=10, le=50, description="Max results")
):
    """
    Autocomplete suggestions from dataset
    Returns matching startup names for search input
    """
    try:
        suggestions = dataset_service.suggest(query, limit=limit)
        return {
            "query": query,
            "suggestions": suggestions,
            "count": len(suggestions)
        }
    except Exception as e:
        logger.error(f"Suggestion error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/startups/lookup")
async def lookup_startup(request: StartupLookupRequest):
    """
    Find startup in dataset (exact or fuzzy match)
    Returns full startup data if found
    """
    try:
        result = dataset_service.lookup(request.name, fuzzy=request.fuzzy)
        
        if result is None:
            return {
                "found": False,
                "name": request.name,
                "message": "Startup not found in dataset. Consider using enrichment."
            }
        
        return {
            "found": True,
            "data": result
        }
    except Exception as e:
        logger.error(f"Lookup error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/enrich")
async def enrich_startup(request: EnrichmentRequest):
    """
    Web enrichment pipeline for unknown startups
    Scrapes data from multiple sources: DuckDuckGo, Crunchbase, GitHub, etc.
    """
    try:
        logger.info(f"Starting enrichment for: {request.name}")
        enriched_data = await enrichment_service.enrich(
            name=request.name,
            website=request.website
        )
        
        return {
            "success": True,
            "name": request.name,
            "data": enriched_data,
            "sources": enriched_data.get("sources", [])
        }
    except Exception as e:
        logger.error(f"Enrichment error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Enrichment failed: {str(e)}"
        )

@app.post("/api/predict")
async def predict_risk(request: PredictRequest):
    """
    XGBoost + SHAP risk scoring
    Returns risk score, probability, and SHAP explanation
    """
    try:
        prediction = ml_service.predict(request.startup_data)
        
        return {
            "success": True,
            "risk_score": prediction["risk_score"],
            "risk_level": prediction["risk_level"],
            "probability": prediction["probability"],
            "shap_values": prediction["shap_values"],
            "feature_importance": prediction["feature_importance"],
            "recommendations": prediction["recommendations"]
        }
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

@app.get("/api/github/{org}")
async def get_github_repos(
    org: str,
    limit: int = Query(default=10, le=50)
):
    """
    GitHub organization repositories
    Returns repo stats, languages, stars, commits
    """
    try:
        repos = await github_service.get_org_repos(org, limit=limit)
        
        if not repos:
            return {
                "success": False,
                "organization": org,
                "message": "No repositories found or organization doesn't exist"
            }
        
        return {
            "success": True,
            "organization": org,
            "repositories": repos,
            "total_repos": len(repos),
            "summary": github_service.get_summary(repos)
        }
    except Exception as e:
        logger.error(f"GitHub error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/news/{company}")
async def get_news(
    company: str,
    limit: int = Query(default=10, le=50)
):
    """
    Latest news from Google News RSS
    Returns recent articles about the company
    """
    try:
        articles = await news_service.get_news(company, limit=limit)
        
        return {
            "success": True,
            "company": company,
            "articles": articles,
            "count": len(articles)
        }
    except Exception as e:
        logger.error(f"News error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stock/{ticker}")
async def get_stock_price(ticker: str):
    """
    Yahoo Finance stock price
    Returns current price, change, and historical data
    """
    try:
        stock_data = await stock_service.get_stock_data(ticker)
        
        if stock_data is None:
            return {
                "success": False,
                "ticker": ticker,
                "message": "Stock ticker not found"
            }
        
        return {
            "success": True,
            "ticker": ticker.upper(),
            "data": stock_data
        }
    except Exception as e:
        logger.error(f"Stock error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/comparables")
async def get_comparables(request: ComparablesRequest):
    """
    Find comparable startups by sector/stage
    Returns benchmark data and similar companies
    """
    try:
        comparables = dataset_service.get_comparables(
            sector=request.sector,
            stage=request.stage,
            limit=request.limit
        )
        
        return {
            "success": True,
            "sector": request.sector,
            "stage": request.stage,
            "comparables": comparables,
            "count": len(comparables),
            "benchmarks": dataset_service.calculate_benchmarks(comparables)
        }
    except Exception as e:
        logger.error(f"Comparables error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# Startup Event Handlers
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("🚀 RiskRadar API starting up...")
    
    # Initialize ML model
    if not ml_service.is_ready():
        logger.warning("⚠️  ML model not loaded - training may be required")
    else:
        logger.info("✅ ML model loaded successfully")
    
    # Initialize dataset
    if not dataset_service.is_ready():
        logger.warning("⚠️  Dataset not loaded")
    else:
        logger.info(f"✅ Dataset loaded: {dataset_service.get_count()} startups")
    
    logger.info("✅ RiskRadar API ready!")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("👋 RiskRadar API shutting down...")

if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )
