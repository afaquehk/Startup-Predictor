# 🛰️ RiskRadar v2 — Startup Risk Intelligence Platform

> Know your risk before the market does.

RiskRadar is a full-stack AI platform that gives founders and investors a **real-time, explainable risk profile** for any startup — whether it's in our dataset of 5,000+ companies or pulled live from the web.

---

## 🆕 What's New in v2

| Feature | v1 | v2 |
|---|---|---|
| Welcome page | ❌ | ✅ Animated hero with particle network |
| User onboarding | ❌ | ✅ 3-step role/goal/sector profiling |
| Startup search | CSV hardcoded | ✅ Smart dialog with autocomplete |
| Unknown startups | ❌ Error | ✅ Live web enrichment pipeline |
| GitHub signals | ❌ | ✅ Repo stats, stars, languages, commits |
| Latest news | ❌ | ✅ Google News RSS, no API key |
| Funding timeline | ❌ | ✅ Visual round-by-round breakdown |
| Stock price | ❌ | ✅ Yahoo Finance integration |
| Comparable startups | ❌ | ✅ Sector/stage benchmarking |
| Export | ❌ | ✅ Markdown report download |
| Dashboard tabs | Single view | ✅ 6-tab layout |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 14)                │
│                                                          │
│  /              Welcome Page (animated, particle canvas) │
│  /onboarding    3-step role + goal + sector profiling    │
│  /dashboard     6-tab dashboard                          │
│    ├─ Overview      → Risk Gauge + Milestone Odds        │
│    ├─ Why Score     → SHAP Waterfall + strategy tips     │
│    ├─ Funding       → Visual round timeline              │
│    ├─ GitHub        → Repo cards + language breakdown    │
│    ├─ Comparables   → Benchmark table vs peers           │
│    └─ News & Intel  → Latest articles                    │
└───────────────────┬─────────────────────────────────────┘
                    │ REST API
┌───────────────────▼─────────────────────────────────────┐
│                     BACKEND (FastAPI)                    │
│                                                          │
│  POST /api/predict         XGBoost + SHAP scoring        │
│  GET  /api/startups/suggest  Dataset autocomplete        │
│  POST /api/startups/lookup   Exact/fuzzy dataset match   │
│  POST /api/enrich           Web enrichment pipeline      │
│  GET  /api/github/{org}     GitHub org repos             │
│  GET  /api/news/{company}   Google News RSS              │
│  GET  /api/stock/{ticker}   Yahoo Finance price          │
│  GET  /api/comparables      Sector/stage benchmarks      │
└───────────────────┬─────────────────────────────────────┘
                    │
     ┌──────────────┼──────────────┐
     ▼              ▼              ▼
  Dataset       XGBoost      Web Sources
  (5,000+)    + SHAP         DuckDuckGo
  CSV          Models        Crunchbase
                              GitHub API
                              Google News
                              Yahoo Finance
```

---

## 🚀 How to Run

### Option 1: Docker (Recommended)
```bash
# Optional: add GitHub token for higher rate limits
echo "GITHUB_TOKEN=ghp_yourtoken" > .env

docker-compose up --build
```
Open http://localhost:3000

### Option 2: Local Dev
```bash
# Backend
pip install -r requirements.txt
python -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## 🔁 User Flow

```
Landing Page → Onboarding (role/goal/sector) → Dashboard
                                                    │
                                          ┌─────────▼──────────┐
                                          │  Search Dialog      │
                                          │  "Enter startup..." │
                                          └─────────┬──────────┘
                                                    │
                              ┌─────────────────────┼──────────────────────┐
                              ▼                                             ▼
                      Found in Dataset                          NOT in Dataset
                      └─ Load from CSV                         └─ Web Enrichment
                      └─ Run XGBoost                              └─ DuckDuckGo
                      └─ SHAP explanation                         └─ Crunchbase
                                                                   └─ GitHub API
                                                                   └─ Google News
                                                                   └─ Run XGBoost
```

---

## 📁 Repository Structure

```
├── src/
│   ├── main.py                    ← FastAPI app (8 endpoints)
│   ├── services/
│   │   ├── enrichment.py          ← Web scraping orchestrator
│   │   ├── github_service.py      ← GitHub API client
│   │   └── news_service.py        ← Google News RSS
│   ├── train.py                   ← Model training pipeline
│   └── preprocess.py              ← Feature engineering
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx               ← Welcome/landing page
│   │   ├── onboarding/page.tsx    ← 3-step user profiling
│   │   └── dashboard/page.tsx     ← Main 6-tab dashboard
│   └── components/
│       ├── StartupSearchDialog.tsx ← Smart search + enrichment UI
│       ├── GitHubInsights.tsx      ← GitHub repo visualization
│       ├── NewsPanel.tsx           ← News feed
│       ├── ComparableStartups.tsx  ← Benchmark table
│       ├── ExportButton.tsx        ← Report download
│       └── charts/
│           ├── RiskGauge.tsx       ← SVG arc gauge
│           ├── ShapWaterfall.tsx   ← SHAP bar chart + strategy tips
│           ├── FundingTimeline.tsx ← Round-by-round timeline
│           └── MilestoneOdds.tsx   ← IPO/Acq probability bars
│
├── dataset/                        ← Raw + processed CSVs
├── models/                         ← Serialized model binaries
├── requirements.txt
├── docker-compose.yml
└── README.md
```

---

## 🌐 Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GITHUB_TOKEN` | Optional | — | GitHub Personal Access Token (increases rate limit from 60→5000 req/hr) |
| `NEXT_PUBLIC_API_URL` | Frontend | `http://localhost:8000` | Backend base URL |
| `FRONTEND_URL` | Backend | — | For CORS allow-list |

---

## 📊 Tech Stack

- **Backend**: FastAPI · Python 3.11 · Uvicorn
- **ML**: XGBoost · Scikit-Learn · SHAP · Pandas · Joblib
- **Web Enrichment**: HTTPX (async) · BeautifulSoup4 · DuckDuckGo API · GitHub API · Google News RSS · Yahoo Finance
- **Frontend**: Next.js 14 · React · TypeScript · Tailwind CSS
- **Charts**: Custom SVG (no Chart.js overhead)
- **DevOps**: Docker · Docker Compose