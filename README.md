# 🎬 Production Estimator

AI-powered screenplay analysis and film production planning platform.

## Features

- 📄 Screenplay Analysis
- 🎬 Scene Breakdown
- 💰 Budget Estimation
- 📅 Shooting Schedule
- 🤖 AI Production Copilot
- 🔐 JWT Authentication

## Tech Stack

React • TypeScript • Vite • Tailwind CSS • FastAPI • PostgreSQL • Gemini AI

## 🚀 Run Locally

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `.env`:

```env
DATABASE_URL=postgresql://YOUR_USERNAME@localhost:5432/production_estimator
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
```

Run:

```bash
uvicorn app.main:app --reload
```

### Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite.

> ⚠️ Never commit your `.env` or API keys.
