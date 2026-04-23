# 🚀 RiskRadar v2 - Deployment Guide

Complete guide for deploying RiskRadar to production.

---

## 📋 Pre-Deployment Checklist

### Backend
- [ ] Set production environment variables
- [ ] Configure GitHub token for higher rate limits
- [ ] Set up proper CORS origins
- [ ] Enable HTTPS/SSL
- [ ] Configure logging level
- [ ] Set up error monitoring (Sentry)
- [ ] Configure rate limiting
- [ ] Set up database (if using one)
- [ ] Test all API endpoints
- [ ] Load production dataset

### Frontend
- [ ] Set `NODE_ENV=production`
- [ ] Configure production API URL
- [ ] Enable analytics (Vercel Analytics)
- [ ] Test build locally (`pnpm build`)
- [ ] Optimize images
- [ ] Configure CDN
- [ ] Set up error tracking
- [ ] Test on multiple devices
- [ ] Check accessibility
- [ ] Verify SEO meta tags

---

## 🐳 Docker Deployment (Recommended)

### Build Images

```bash
# Build backend
cd backend
docker build -t riskradar-backend:latest .

# Build frontend
cd ..
docker build -f Dockerfile.frontend -t riskradar-frontend:latest .
```

### Run with Docker Compose

```bash
# Production mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Variables

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    image: riskradar-backend:latest
    ports:
      - "8000:8000"
    environment:
      - API_HOST=0.0.0.0
      - API_PORT=8000
      - FRONTEND_URL=https://yourdomain.com
      - GITHUB_TOKEN=${GITHUB_TOKEN}
    restart: always

  frontend:
    image: riskradar-frontend:latest
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
    depends_on:
      - backend
    restart: always
```

Run with:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## ☁️ Cloud Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Frontend on Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Environment Variables in Vercel**:
- `NEXT_PUBLIC_API_URL` = Your backend URL

#### Backend on Railway

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Set root directory to `backend`
5. Add environment variables:
   - `GITHUB_TOKEN`
   - `FRONTEND_URL`
   - `API_HOST=0.0.0.0`
   - `API_PORT=8000`

### Option 2: AWS (Full Stack)

#### Backend on AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd backend
eb init -p python-3.11 riskradar-backend

# Create environment
eb create riskradar-prod

# Deploy
eb deploy
```

#### Frontend on AWS Amplify

1. Go to AWS Amplify Console
2. Connect your GitHub repository
3. Set build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install -g pnpm
           - pnpm install
       build:
         commands:
           - pnpm build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

### Option 3: DigitalOcean App Platform

1. Go to https://cloud.digitalocean.com/apps
2. Click "Create App"
3. Connect GitHub repository
4. Configure components:

**Backend**:
- Type: Web Service
- Source Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Run Command: `python run.py`
- Port: 8000

**Frontend**:
- Type: Web Service
- Source Directory: `/`
- Build Command: `pnpm install && pnpm build`
- Run Command: `pnpm start`
- Port: 3000

### Option 4: Render

#### Backend

1. Go to https://render.com
2. New → Web Service
3. Connect repository
4. Settings:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python run.py`
   - Environment: Python 3.11

#### Frontend

1. New → Static Site
2. Connect repository
3. Settings:
   - Build Command: `pnpm install && pnpm build`
   - Publish Directory: `.next`

---

## 🔒 Security Configuration

### Backend Security

#### 1. CORS Configuration

Update `backend/src/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://yourdomain.com",
        "https://www.yourdomain.com"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

#### 2. Rate Limiting

Install:
```bash
pip install slowapi
```

Add to `main.py`:
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/api/startups/suggest")
@limiter.limit("10/minute")
async def suggest_startups(request: Request, ...):
    ...
```

#### 3. HTTPS Only

```python
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

if os.getenv("ENVIRONMENT") == "production":
    app.add_middleware(HTTPSRedirectMiddleware)
```

### Frontend Security

#### 1. Content Security Policy

Add to `next.config.mjs`:

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  }
}
```

---

## 📊 Monitoring & Logging

### Backend Monitoring

#### Sentry Integration

```bash
pip install sentry-sdk[fastapi]
```

```python
import sentry_sdk

sentry_sdk.init(
    dsn="your-sentry-dsn",
    traces_sample_rate=1.0,
)
```

#### Logging

Update `main.py`:

```python
import logging
from logging.handlers import RotatingFileHandler

# Configure logging
handler = RotatingFileHandler(
    'logs/app.log',
    maxBytes=10000000,
    backupCount=5
)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[handler]
)
```

### Frontend Monitoring

#### Vercel Analytics

Already included! Just deploy to Vercel.

#### Custom Analytics

```typescript
// lib/analytics.ts
export const trackEvent = (name: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, properties)
  }
}
```

---

## 🗄️ Database Setup (Optional)

If you want to use a database instead of CSV:

### PostgreSQL Setup

```bash
pip install psycopg2-binary sqlalchemy
```

```python
# backend/src/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          # Your deployment commands

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          npm i -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 📈 Performance Optimization

### Backend

1. **Enable Gzip Compression**:
```python
from fastapi.middleware.gzip import GZipMiddleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
```

2. **Add Caching**:
```bash
pip install redis
```

3. **Use Connection Pooling**:
```python
import httpx

client = httpx.AsyncClient(
    limits=httpx.Limits(max_keepalive_connections=20)
)
```

### Frontend

1. **Image Optimization**: Already handled by Next.js
2. **Code Splitting**: Automatic with Next.js
3. **CDN**: Use Vercel or Cloudflare

---

## 🧪 Production Testing

### Load Testing

```bash
# Install Apache Bench
apt-get install apache2-utils

# Test backend
ab -n 1000 -c 10 http://your-api.com/api/health

# Or use k6
k6 run load-test.js
```

### End-to-End Testing

```bash
# Install Playwright
pnpm add -D @playwright/test

# Run tests
pnpm playwright test
```

---

## 📝 Post-Deployment

### 1. Verify Services

```bash
# Check backend
curl https://api.yourdomain.com/api/health

# Check frontend
curl https://yourdomain.com
```

### 2. Monitor Logs

```bash
# Docker
docker-compose logs -f

# Railway
railway logs

# Vercel
vercel logs
```

### 3. Set Up Alerts

- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Performance monitoring (New Relic, DataDog)

---

## 🔧 Troubleshooting

### Common Issues

**CORS Errors**:
- Check `FRONTEND_URL` in backend
- Verify `allow_origins` in CORS middleware

**API Connection Failed**:
- Check `NEXT_PUBLIC_API_URL` in frontend
- Verify backend is running
- Check firewall rules

**Build Failures**:
- Clear cache: `pnpm clean && pnpm install`
- Check Node.js version (18+)
- Check Python version (3.11+)

---

## 📞 Support

For deployment issues:
1. Check logs first
2. Review this guide
3. Check GitHub Issues
4. Contact support@riskradar.io

---

**Ready to deploy!** 🚀
