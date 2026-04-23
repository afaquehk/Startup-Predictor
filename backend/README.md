# 🛰️ RiskRadar Backend API

AI-powered startup risk intelligence platform backend built with FastAPI.

## 🚀 Quick Start

### Option 1: Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run the server
python run.py
```

The API will be available at `http://localhost:8000`

### Option 2: Docker

```bash
docker build -t riskradar-backend .
docker run -p 8000:8000 riskradar-backend
```

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## 🔌 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check with service status |
| GET | `/api/startups/suggest` | Autocomplete suggestions |
| POST | `/api/startups/lookup` | Find startup in dataset |
| POST | `/api/enrich` | Web enrichment for unknown startups |
| POST | `/api/predict` | XGBoost risk scoring + SHAP |
| GET | `/api/github/{org}` | GitHub organization repos |
| GET | `/api/news/{company}` | Latest news articles |
| GET | `/api/stock/{ticker}` | Stock price data |
| POST | `/api/comparables` | Find similar startups |

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
# GitHub API Token (optional - increases rate limit)
GITHUB_TOKEN=your_token_here

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
```

## 📊 Services

### ML Service
- XGBoost risk prediction
- SHAP explanations
- Feature importance analysis

### Dataset Service
- 5,000+ startup database
- Fuzzy search
- Sector/stage filtering

### Enrichment Service
- DuckDuckGo search
- Crunchbase scraping
- Website data extraction

### GitHub Service
- Repository statistics
- Language breakdown
- Commit activity

### News Service
- Google News RSS
- Latest articles
- No API key required

### Stock Service
- Yahoo Finance integration
- Real-time prices
- Historical data

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:8000/api/health

# Test startup lookup
curl -X POST http://localhost:8000/api/startups/lookup \
  -H "Content-Type: application/json" \
  -d '{"name": "Stripe", "fuzzy": true}'

# Test GitHub API
curl http://localhost:8000/api/github/stripe
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── main.py                 # FastAPI app
│   └── services/
│       ├── ml_service.py       # ML predictions
│       ├── dataset_service.py  # Dataset management
│       ├── enrichment_service.py # Web scraping
│       ├── github_service.py   # GitHub API
│       ├── news_service.py     # News fetching
│       └── stock_service.py    # Stock data
├── dataset/
│   └── startups.csv           # Startup database
├── models/
│   └── xgboost_model.pkl      # Trained model
├── requirements.txt
├── run.py
└── README.md
```

## 🔒 Security

- CORS configured for frontend
- Rate limiting on external APIs
- Input validation with Pydantic
- Error handling and logging

## 📝 License

MIT License - See LICENSE file for details
