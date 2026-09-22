from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.project import Project
from app.models.screenplay import Screenplay
from app.models.screenplay_analysis import (
    ScreenplayAnalysis as ScreenplayAnalysisModel
)
from app.models.budget import Budget
from app.models.user import User

from app.services.auth import get_current_user
from app.services.budget_calculator import calculate_budget

from app.schemas.analysis import ScreenplayAnalysis


router = APIRouter(
    prefix="/projects",
    tags=["Budget"]
)


@router.post("/{project_id}/budget")
def generate_budget(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check project belongs to current user
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

    # Get latest screenplay
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

    # Get saved AI analysis
    saved_analysis = (
        db.query(ScreenplayAnalysisModel)
        .filter(
            ScreenplayAnalysisModel.screenplay_id
            == screenplay.id
        )
        .first()
    )

    if not saved_analysis:
        raise HTTPException(
            status_code=404,
            detail="No screenplay analysis found"
        )

    # Validate saved analysis using Pydantic schema
    analysis = ScreenplayAnalysis.model_validate(
        saved_analysis.analysis_data
    )

    # Calculate deterministic budget
    budget_data = calculate_budget(
        analysis
    )

    # Check if budget already exists
    existing_budget = (
        db.query(Budget)
        .filter(
            Budget.project_id == project.id
        )
        .first()
    )

    if existing_budget:

        existing_budget.crew_cost = (
            budget_data["crew_cost"]
        )

        existing_budget.equipment_cost = (
            budget_data["equipment_cost"]
        )

        existing_budget.location_cost = (
            budget_data["location_cost"]
        )

        existing_budget.props_cost = (
            budget_data["props_cost"]
        )

        existing_budget.costumes_cost = (
            budget_data["costumes_cost"]
        )

        existing_budget.transport_cost = (
            budget_data["transport_cost"]
        )

        existing_budget.contingency_cost = (
            budget_data["contingency_cost"]
        )

        existing_budget.total_cost = (
            budget_data["total_cost"]
        )

        db.commit()
        db.refresh(existing_budget)

        budget = existing_budget

    else:

        budget = Budget(
            project_id=project.id,

            crew_cost=budget_data["crew_cost"],

            equipment_cost=budget_data[
                "equipment_cost"
            ],

            location_cost=budget_data[
                "location_cost"
            ],

            props_cost=budget_data[
                "props_cost"
            ],

            costumes_cost=budget_data[
                "costumes_cost"
            ],

            transport_cost=budget_data[
                "transport_cost"
            ],

            contingency_cost=budget_data[
                "contingency_cost"
            ],

            total_cost=budget_data[
                "total_cost"
            ]
        )

        db.add(budget)
        db.commit()
        db.refresh(budget)

    project.status = "budget_generated"

    db.commit()

    return {
        "budget_id": budget.id,
        "project_id": project.id,
        "status": project.status,
        "budget": {
            "crew_cost": float(
                budget.crew_cost
            ),
            "equipment_cost": float(
                budget.equipment_cost
            ),
            "location_cost": float(
                budget.location_cost
            ),
            "props_cost": float(
                budget.props_cost
            ),
            "costumes_cost": float(
                budget.costumes_cost
            ),
            "transport_cost": float(
                budget.transport_cost
            ),
            "contingency_cost": float(
                budget.contingency_cost
            ),
            "total_cost": float(
                budget.total_cost
            )
        }
    }


@router.get("/{project_id}/budget")
def get_budget(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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

    budget = (
        db.query(Budget)
        .filter(
            Budget.project_id == project.id
        )
        .first()
    )

    if not budget:
        raise HTTPException(
            status_code=404,
            detail="No budget found"
        )

    return {
        "budget_id": budget.id,
        "project_id": project.id,
        "status": project.status,
        "budget": {
            "crew_cost": float(
                budget.crew_cost
            ),
            "equipment_cost": float(
                budget.equipment_cost
            ),
            "location_cost": float(
                budget.location_cost
            ),
            "props_cost": float(
                budget.props_cost
            ),
            "costumes_cost": float(
                budget.costumes_cost
            ),
            "transport_cost": float(
                budget.transport_cost
            ),
            "contingency_cost": float(
                budget.contingency_cost
            ),
            "total_cost": float(
                budget.total_cost
            )
        }
    }