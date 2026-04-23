# 🚀 RiskRadar v2 - Quick Start Guide

Get RiskRadar running in **under 5 minutes**!

---

## ⚡ Fastest Way (Windows)

1. **Double-click** `start.bat`
2. Wait for services to start
3. Open http://localhost:3000

**That's it!** 🎉

---

## ⚡ Fastest Way (Mac/Linux)

```bash
./start.sh
```

Then open http://localhost:3000

---

## 🐳 Using Docker (Recommended for Production)

```bash
docker-compose up --build
```

Then open:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/api/docs

---

## 📋 Manual Setup (If Scripts Don't Work)

### Step 1: Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env     # Windows
cp .env.example .env       # Mac/Linux

# Run server
python run.py
```

Backend will start on http://localhost:8000

### Step 2: Frontend (New Terminal)

```bash
# Install dependencies
pnpm install

# Copy environment file
copy .env.local.example .env.local     # Windows
cp .env.local.example .env.local       # Mac/Linux

# Run development server
pnpm dev
```

Frontend will start on http://localhost:3000

---

## ✅ Verify It's Working

### Test Backend

Open http://localhost:8000/api/health

You should see:
```json
{
  "status": "healthy",
  "services": {
    "ml_model": true,
    "dataset": true,
    "github": true,
    "news": true,
    "stock": true
  }
}
```

### Test Frontend

Open http://localhost:3000

You should see the RiskRadar landing page with:
- Animated gradient background
- "Get Started" button
- Feature cards

---

## 🎯 First Steps

1. **Click "Get Started"** on the landing page
2. **Search for a startup** (try "Stripe", "Airbnb", or "OpenAI")
3. **View the risk analysis** in the dashboard
4. **Explore the tabs**:
   - Overview - Charts and stats
   - Startups - Full portfolio
   - Profile - User info
   - Settings - Configuration

---

## 🔧 Common Issues

### Port Already in Use

**Backend (8000)**:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

**Frontend (3000)**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Python Not Found

Install Python 3.11+ from https://www.python.org/downloads/

### pnpm Not Found

```bash
npm install -g pnpm
```

### Module Not Found

**Backend**:
```bash
cd backend
pip install -r requirements.txt
```

**Frontend**:
```bash
pnpm install
```

---

## 🌐 URLs Reference

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main application |
| Backend | http://localhost:8000 | API server |
| API Docs | http://localhost:8000/api/docs | Swagger UI |
| ReDoc | http://localhost:8000/api/redoc | Alternative docs |
| Health | http://localhost:8000/api/health | Health check |

---

## 📱 Test the API

### Using curl

```bash
# Health check
curl http://localhost:8000/api/health

# Search startups
curl "http://localhost:8000/api/startups/suggest?query=stripe&limit=5"

# Lookup startup
curl -X POST http://localhost:8000/api/startups/lookup \
  -H "Content-Type: application/json" \
  -d '{"name": "Stripe", "fuzzy": true}'

# Get GitHub repos
curl http://localhost:8000/api/github/stripe

# Get news
curl http://localhost:8000/api/news/stripe

# Get stock data
curl http://localhost:8000/api/stock/COIN
```

### Using Browser

Just paste these URLs:
- http://localhost:8000/api/health
- http://localhost:8000/api/startups/suggest?query=stripe
- http://localhost:8000/api/github/stripe
- http://localhost:8000/api/news/stripe

---

## 🎨 Customize

### Change Backend Port

Edit `backend/.env`:
```env
API_PORT=8080
```

### Change Frontend Port

```bash
pnpm dev -p 3001
```

### Add GitHub Token (Optional)

Edit `backend/.env`:
```env
GITHUB_TOKEN=ghp_your_token_here
```

This increases GitHub API rate limit from 60 to 5,000 requests/hour.

Get a token: https://github.com/settings/tokens

---

## 📚 Next Steps

1. **Read the full README**: `README.md`
2. **Explore the API**: http://localhost:8000/api/docs
3. **Check the code**: Start with `backend/src/main.py` and `app/page.tsx`
4. **Customize the design**: Edit `app/globals.css`
5. **Add features**: See `PROJECT_SUMMARY.md` for ideas

---

## 🆘 Need Help?

1. **Check logs**: Look at the terminal output
2. **Read docs**: `README.md` and `PROJECT_SUMMARY.md`
3. **API docs**: http://localhost:8000/api/docs
4. **GitHub Issues**: Open an issue if you find a bug

---

## 🎉 You're Ready!

RiskRadar is now running. Start analyzing startups and exploring the platform!

**Happy analyzing!** 🛰️
