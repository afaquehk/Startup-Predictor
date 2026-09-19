# RiskRadar

RiskRadar is a full-stack application for exploring startup data and assessing business risk. It provides a Next.js dashboard, a FastAPI backend, startup lookup, external data enrichment, risk scoring, and comparison tools.

## Features

- Search startup records with autocomplete and fuzzy matching.
- Enrich unknown startups using public web sources.
- Calculate risk scores from funding, employees, company age, valuation, and funding efficiency.
- Return risk levels, feature impacts, and recommendations.
- Retrieve GitHub repository summaries and Google News results.
- Compare startups by sector and funding stage.
- Run the frontend and backend locally or with Docker Compose.

## Technology

### Frontend

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Radix UI
- Framer Motion
- Recharts

### Backend

- Python 3.11
- FastAPI
- Uvicorn
- Pydantic
- HTTPX
- BeautifulSoup4
- feedparser

### Deployment

- Docker
- Docker Compose
- Next.js standalone output

## Architecture

The Next.js frontend communicates with the FastAPI backend through the typed client in `lib/api.ts`.

The backend exposes the API routes and coordinates the following services:

- Dataset lookup and comparisons
- Startup enrichment
- Risk scoring
- GitHub data retrieval
- News retrieval
- Stock-data responses

The application does not use a database. Runtime startup records are loaded from `backend/dataset/startups.json`.

## Machine Learning and Risk Scoring

The `POST /api/predict` endpoint returns a risk score, risk level, probability, feature impacts, feature importance, and recommendations.

The current implementation uses rule-based scoring based on:

- Funding
- Employee count
- Years since founding
- Valuation
- Funding per employee
- Growth rate

The current service is a demo implementation. It does not load a trained XGBoost model or calculate SHAP values. The exploratory notebook contains preprocessing and analysis work based on the raw startup-success dataset, but it is not connected to the running API.

## Project Structure

```text
.
|-- app/                         Next.js routes and global styles
|-- components/                  React screens and UI components
|-- hooks/                       Shared React hooks
|-- lib/                         API client and utilities
|-- public/                      Static assets
|-- backend/
|   |-- src/main.py              FastAPI application
|   |-- src/services/            Backend services
|   |-- dataset/startups.json    Runtime startup dataset
|   |-- requirements.txt         Python dependencies
|   `-- Dockerfile               Backend image definition
|-- data/raw/                    Source data for analysis
|-- notebooks/                   Exploratory notebooks
|-- docker-compose.yml           Frontend and backend orchestration
|-- Dockerfile.frontend          Frontend image definition
|-- package.json                 Frontend scripts and dependencies
|-- pnpm-lock.yaml               Locked frontend dependencies
`-- README.md
```

## Getting Started

### Requirements

- Node.js 20 or newer
- pnpm
- Python 3.11 or newer
- Docker and Docker Compose, if using containers

### Run locally

Start the backend in one terminal:

```bash
cd backend
python -m venv .venv
```

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

macOS or Linux:

```bash
source .venv/bin/activate
```

Install dependencies and start the API:

```bash
pip install -r requirements.txt
cp .env.example .env
python run.py
```

Start the frontend in a second terminal from the project root:

```bash
pnpm install
cp .env.local.example .env.local
pnpm dev
```

Open the application at `http://localhost:3000`.

The backend is available at `http://localhost:8000`. API documentation is available at `http://localhost:8000/api/docs`.

The included `start.bat` and `start.sh` scripts can start both services.

### Run with Docker

```bash
docker compose up --build
```

The frontend runs on port 3000 and the backend runs on port 8000.

## Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Create `backend/.env`:

```env
GITHUB_TOKEN=your_github_token_here
FRONTEND_URL=http://localhost:3000
API_HOST=0.0.0.0
API_PORT=8000
```

`GITHUB_TOKEN` is optional. It increases the GitHub API rate limit. Do not commit real environment files or credentials.

## API Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/health` | Check backend service status |
| GET | `/api/startups/suggest` | Return startup suggestions |
| POST | `/api/startups/lookup` | Find a startup in the dataset |
| POST | `/api/enrich` | Enrich an unknown startup |
| POST | `/api/predict` | Return risk scoring results |
| GET | `/api/github/{org}` | Return GitHub organization data |
| GET | `/api/news/{company}` | Return Google News results |
| GET | `/api/stock/{ticker}` | Return stock-data demo results |
| POST | `/api/comparables` | Return comparable startups and benchmarks |

## Validation

Frontend commands:

```bash
pnpm type-check
pnpm lint
pnpm build
```

Backend verification:

```bash
curl http://localhost:8000/api/health
```

## Screenshots

Screenshots can be added here for:

- Landing page
- Dashboard overview
- Startup search
- Startup comparison
- API documentation

## Deployment

The repository includes Docker configuration for a two-container deployment:

- `Dockerfile.frontend` builds the Next.js application.
- `backend/Dockerfile` builds the FastAPI service.
- `docker-compose.yml` runs both services together.

Configure the production environment variables, then run:

```bash
docker compose up --build -d
```

For hosted deployments, deploy the frontend and backend as separate services. Set `NEXT_PUBLIC_API_URL` to the public backend URL and configure `FRONTEND_URL` with the public frontend URL.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
