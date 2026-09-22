from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import engine, Base

from app.models.user import User
from app.models.project import Project
from app.models.screenplay import Screenplay
from app.models.screenplay_analysis import ScreenplayAnalysis
from app.models.budget import Budget
from app.models.shooting_schedule import ShootingSchedule
from app.api.schedules import router as schedules_router
from app.api.copilot import router as copilot_router


from app.api.screenplays import router as screenplays_router
from app.api.auth import router as auth_router
from app.api.projects import router as projects_router
from app.api.analysis import router as analysis_router
from app.api.budgets import router as budget_router


app = FastAPI(
    title="Production Estimator API",
    description="AI-powered screenplay production planning platform",
    version="1.0.0",
)


# ==================== CORS ====================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== ROUTERS ====================

app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(screenplays_router)
app.include_router(analysis_router)
app.include_router(budget_router)
app.include_router(schedules_router)
app.include_router(copilot_router)


# ==================== ROOT ====================

@app.get("/")
def root():
    return {
        "message": "Production Estimator API is running",
        "status": "ok",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }
