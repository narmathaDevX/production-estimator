from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.project import Project
from app.models.screenplay import Screenplay
from app.models.screenplay_analysis import ScreenplayAnalysis
from app.models.shooting_schedule import ShootingSchedule
from app.models.user import User

from app.services.auth import get_current_user
from app.services.schedule_calculator import (
    generate_shooting_schedule
)

from app.schemas.analysis import ScreenplayAnalysis as ScreenplayAnalysisSchema


router = APIRouter(
    prefix="/projects",
    tags=["Shooting Schedule"]
)


# ============================================================
# GENERATE SHOOTING SCHEDULE
# ============================================================

@router.post("/{project_id}/schedule")
def generate_schedule(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # --------------------------------------------------------
    # Check project ownership
    # --------------------------------------------------------

    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.user_id == current_user.id
        )
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )


    # --------------------------------------------------------
    # Get latest screenplay
    # --------------------------------------------------------

    screenplay = (
        db.query(Screenplay)
        .filter(
            Screenplay.project_id == project.id
        )
        .order_by(
            Screenplay.uploaded_at.desc()
        )
        .first()
    )

    if not screenplay:
        raise HTTPException(
            status_code=404,
            detail="No screenplay uploaded"
        )


    # --------------------------------------------------------
    # Get saved AI analysis
    # --------------------------------------------------------

    saved_analysis = (
        db.query(ScreenplayAnalysis)
        .filter(
            ScreenplayAnalysis.screenplay_id
            == screenplay.id
        )
        .first()
    )

    if not saved_analysis:
        raise HTTPException(
            status_code=404,
            detail="No screenplay analysis found"
        )


    # --------------------------------------------------------
    # Validate analysis
    # --------------------------------------------------------

    analysis = (
        ScreenplayAnalysisSchema.model_validate(
            saved_analysis.analysis_data
        )
    )


    # --------------------------------------------------------
    # Generate deterministic schedule
    # --------------------------------------------------------

    schedule_data = (
        generate_shooting_schedule(
            analysis
        )
    )


    # --------------------------------------------------------
    # Check existing schedule
    # --------------------------------------------------------

    existing_schedule = (
        db.query(ShootingSchedule)
        .filter(
            ShootingSchedule.project_id
            == project.id
        )
        .first()
    )


    if existing_schedule:

        existing_schedule.schedule_data = (
            schedule_data
        )

        db.commit()

        db.refresh(
            existing_schedule
        )

        schedule = existing_schedule

    else:

        schedule = ShootingSchedule(
            project_id=project.id,
            schedule_data=schedule_data
        )

        db.add(schedule)

        db.commit()

        db.refresh(schedule)


    # --------------------------------------------------------
    # Update project status
    # --------------------------------------------------------

    project.status = (
        "schedule_generated"
    )

    db.commit()


    return {
        "schedule_id": schedule.id,
        "project_id": project.id,
        "status": project.status,
        "schedule": schedule.schedule_data
    }


# ============================================================
# GET SAVED SHOOTING SCHEDULE
# ============================================================

@router.get("/{project_id}/schedule")
def get_schedule(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # --------------------------------------------------------
    # Check project ownership
    # --------------------------------------------------------

    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.user_id == current_user.id
        )
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )


    # --------------------------------------------------------
    # Get saved schedule
    # --------------------------------------------------------

    schedule = (
        db.query(ShootingSchedule)
        .filter(
            ShootingSchedule.project_id
            == project.id
        )
        .first()
    )


    if not schedule:

        raise HTTPException(
            status_code=404,
            detail="No shooting schedule found"
        )


    return {
        "schedule_id": schedule.id,
        "project_id": project.id,
        "status": project.status,
        "schedule": schedule.schedule_data
    }
