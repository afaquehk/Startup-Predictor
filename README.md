# 🛰️ RiskRadar v2 - Startup Risk Intelligence Platform

> **Know your risk before the market does.**

RiskRadar is a production-grade, full-stack AI platform that delivers real-time, explainable risk profiles for any startup — whether it's in our dataset of 5,000+ companies or pulled live from the web.

![RiskRadar Banner](https://img.shields.io/badge/RiskRadar-v2.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/status-production-success?style=for-the-badge)

---

## ✨ Features

### 🎯 Core Capabilities

- **🔍 Smart Search** - Autocomplete from 5,000+ startup database with fuzzy matching
- **🤖 AI Enrichment** - Automatic web scraping for unknown startups (DuckDuckGo, Crunchbase, GitHub)
- **📊 Risk Scoring** - XGBoost ML model with SHAP explanations
- **💻 GitHub Insights** - Repository stats, language breakdown, commit activity
- **📰 News Feed** - Latest articles from Google News RSS (no API key needed)
- **📈 Stock Prices** - Real-time data from Yahoo Finance
- **🔄 Comparables** - Sector/stage benchmarking against similar startups
- **📥 Export Reports** - Download analysis as Markdown

### 🎨 Professional UI

- **Modern Design** - Dark fintech theme with electric blue accents
- **Smooth Animations** - Framer Motion transitions throughout
- **Responsive** - Mobile-first design, works on all devices
- **Accessible** - WCAG compliant components
- **Fast** - Optimized performance with Next.js 14

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and pnpm
- **Python** 3.11+
- **Docker** (optional, for containerized deployment)

### Option 1: Local Development

#### Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run the server
python run.py
```

Backend will be available at `http://localhost:8000`

#### Frontend

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.local.example .env.local

# Run development server
pnpm dev
```

Frontend will be available at `http://localhost:3000`

### Option 2: Docker (Recommended for Production)

```bash
# Build and run both services
docker-compose up --build

# Or run in detached mode
docker-compose up -d
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/api/docs`

---

## 📁 Project Structure

```
riskradar/
├── backend/                    # FastAPI Backend
│   ├── src/
│   │   ├── main.py            # API server (8 endpoints)
│   │   └── services/
│   │       ├── ml_service.py          # XGBoost + SHAP
│   │       ├── dataset_service.py     # Dataset management
│   │       ├── enrichment_service.py  # Web scraping
│   │       ├── github_service.py      # GitHub API
│   │       ├── news_service.py        # Google News
│   │       └── stock_service.py       # Yahoo Finance
│   ├── dataset/               # Startup database CSV
│   ├── models/                # Trained ML models
│   ├── requirements.txt
│   ├── run.py
│   └── Dockerfile
│
├── app/                       # Next.js App Router
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
│
├── components/               # React Components
│   ├── welcome-screen.tsx           # Animated landing
│   ├── startup-search-dialog.tsx    # Smart search UI
│   ├── dashboard/
│   │   ├── index.tsx                # Main dashboard
│   │   ├── dashboard-tab.tsx        # Overview tab
│   │   ├── startups-tab.tsx         # Startups list
│   │   ├── profile-tab.tsx          # User profile
│   │   └── settings-tab.tsx         # Settings
│   └── ui/                          # 57 UI components
│
├── lib/
│   ├── api.ts                # Backend API client
│   └── utils.ts              # Utility functions
│
├── docker-compose.yml        # Multi-container setup
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check with service status |
| `GET` | `/api/startups/suggest` | Autocomplete suggestions |
| `POST` | `/api/startups/lookup` | Find startup in dataset |
| `POST` | `/api/enrich` | Web enrichment for unknown startups |
| `POST` | `/api/predict` | XGBoost risk scoring + SHAP |
| `GET` | `/api/github/{org}` | GitHub organization repos |
| `GET` | `/api/news/{company}` | Latest news articles |
| `GET` | `/api/stock/{ticker}` | Stock price data |
| `POST` | `/api/comparables` | Find similar startups |

**Full API Documentation**: http://localhost:8000/api/docs

---

## 🎨 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **UI Components**: Radix UI
- **Charts**: Recharts
- **State**: React Hooks

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11
- **ML**: XGBoost, SHAP, Scikit-learn
- **Data**: Pandas, NumPy
- **HTTP**: HTTPX (async)
- **Scraping**: BeautifulSoup4
- **APIs**: GitHub, Google News RSS, Yahoo Finance

### DevOps
- **Containerization**: Docker, Docker Compose
- **Server**: Uvicorn (ASGI)
- **Process Manager**: PM2 (optional)

---

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# GitHub API Token (optional - increases rate limit from 60 to 5000 req/hr)
GITHUB_TOKEN=your_github_token_here

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
```

### Frontend Environment Variables

Create `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🧪 Testing

### Backend

```bash
cd backend

# Test health endpoint
curl http://localhost:8000/api/health

# Test startup lookup
curl -X POST http://localhost:8000/api/startups/lookup \
  -H "Content-Type: application/json" \
  -d '{"name": "Stripe", "fuzzy": true}'

# Test GitHub API
curl http://localhost:8000/api/github/stripe

# Test news
curl http://localhost:8000/api/news/stripe

# Test stock data
curl http://localhost:8000/api/stock/COIN
```

### Frontend

```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

---

## 📊 Data Flow

```
User searches "Stripe"
        ↓
Frontend calls /api/startups/lookup
        ↓
Backend checks dataset
        ↓
    ┌───┴───┐
    ↓       ↓
  Found   Not Found
    ↓       ↓
 Return  /api/enrich
  Data      ↓
         Web Scraping
         (DuckDuckGo, Crunchbase, GitHub)
            ↓
         Return Enriched Data
            ↓
    /api/predict (XGBoost + SHAP)
            ↓
    /api/github/{org}
            ↓
    /api/news/{company}
            ↓
    /api/stock/{ticker}
            ↓
    /api/comparables
            ↓
    Display in 6-tab Dashboard
```

---

## 🚢 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure environment variables
- [ ] Set up GitHub token for higher rate limits
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up monitoring (e.g., Sentry)
- [ ] Configure logging
- [ ] Set up backups for dataset
- [ ] Enable rate limiting
- [ ] Configure CDN for static assets

### Deploy to Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy Backend (Railway/Render/Fly.io)

```bash
# Example for Railway
railway login
railway init
railway up
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Radix UI** for accessible components
- **Tailwind CSS** for utility-first styling
- **FastAPI** for the amazing Python framework
- **XGBoost** for ML capabilities
- **SHAP** for explainable AI

---

## 📧 Support

For support, email support@riskradar.io or open an issue on GitHub.

---

<div align="center">

**Built with ❤️ for the startup ecosystem**

[Website](https://riskradar.io) • [Documentation](https://docs.riskradar.io) • [API](https://api.riskradar.io)

</div>
