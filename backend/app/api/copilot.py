from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.project import Project
from app.models.screenplay import Screenplay
from app.models.screenplay_analysis import ScreenplayAnalysis
from app.models.budget import Budget
from app.models.shooting_schedule import ShootingSchedule
from app.models.user import User

from app.schemas.analysis import ScreenplayAnalysis as ScreenplayAnalysisSchema

from app.services.auth import get_current_user
from app.services.copilot import ask_copilot


router = APIRouter(
    prefix="/projects",
    tags=["AI Copilot"]
)


class CopilotRequest(BaseModel):
    question: str


@router.post("/{project_id}/copilot")
def copilot(
    project_id: int,
    request: CopilotRequest,
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
    # Get screenplay analysis
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


    # Validate analysis structure

    try:
        analysis = ScreenplayAnalysisSchema.model_validate(
            saved_analysis.analysis_data
        )
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid screenplay analysis: {error}"
        )


    # --------------------------------------------------------
    # Get budget
    # --------------------------------------------------------

    saved_budget = (
        db.query(Budget)
        .filter(
            Budget.project_id == project.id
        )
        .first()
    )


    budget_data = None

    if saved_budget:

        budget_data = {
            "crew_cost": float(saved_budget.crew_cost),
            "equipment_cost": float(
                saved_budget.equipment_cost
            ),
            "location_cost": float(
                saved_budget.location_cost
            ),
            "props_cost": float(
                saved_budget.props_cost
            ),
            "costumes_cost": float(
                saved_budget.costumes_cost
            ),
            "transport_cost": float(
                saved_budget.transport_cost
            ),
            "contingency_cost": float(
                saved_budget.contingency_cost
            ),
            "total_cost": float(
                saved_budget.total_cost
            )
        }


    # --------------------------------------------------------
    # Get shooting schedule
    # --------------------------------------------------------

    saved_schedule = (
        db.query(ShootingSchedule)
        .filter(
            ShootingSchedule.project_id == project.id
        )
        .first()
    )


    schedule_data = None

    if saved_schedule:
        schedule_data = saved_schedule.schedule_data


    # --------------------------------------------------------
    # Validate question
    # --------------------------------------------------------

    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )


    # --------------------------------------------------------
    # Ask Gemini Copilot
    # --------------------------------------------------------

    try:

        answer = ask_copilot(
            question=question,
            analysis=analysis.model_dump(),
            budget=budget_data,
            schedule=schedule_data
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Copilot failed: {error}"
        )


    # --------------------------------------------------------
    # Return answer
    # --------------------------------------------------------

    return {
        "project_id": project.id,
        "question": question,
        "answer": answer
    }