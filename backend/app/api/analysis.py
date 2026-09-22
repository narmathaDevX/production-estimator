from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.project import Project
from app.models.screenplay import Screenplay
from app.models.screenplay_analysis import ScreenplayAnalysis
from app.models.user import User

from app.services.auth import get_current_user
from app.services.screenplay_parser import extract_pdf_text
from app.services.ai_analyzer import analyze_screenplay


router = APIRouter(
    prefix="/projects",
    tags=["Analysis"]
)


@router.post("/{project_id}/analyze")
def analyze_project_screenplay(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # --------------------------------------------------
    # Find project
    # --------------------------------------------------

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


    # --------------------------------------------------
    # Find latest uploaded screenplay
    # --------------------------------------------------

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
            detail="No screenplay uploaded for this project"
        )


    # --------------------------------------------------
    # Extract screenplay text
    # --------------------------------------------------

    try:

        screenplay_text = extract_pdf_text(
            screenplay.file_path
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Failed to extract screenplay text: "
                f"{error}"
            )
        )


    if not screenplay_text.strip():

        raise HTTPException(
            status_code=400,
            detail="Screenplay contains no readable text"
        )


    # --------------------------------------------------
    # Analyze screenplay with Gemini
    # --------------------------------------------------

    try:

        analysis = analyze_screenplay(
            screenplay_text
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {error}"
        )


    # --------------------------------------------------
    # Convert Pydantic analysis to JSON-compatible dict
    # --------------------------------------------------

    analysis_data = analysis.model_dump()


    # --------------------------------------------------
    # Check whether analysis already exists
    # --------------------------------------------------

    existing_analysis = (
        db.query(ScreenplayAnalysis)
        .filter(
            ScreenplayAnalysis.screenplay_id
            == screenplay.id
        )
        .first()
    )


    # --------------------------------------------------
    # Update existing analysis
    # --------------------------------------------------

    if existing_analysis:

        existing_analysis.analysis_data = analysis_data

        db.commit()
        db.refresh(existing_analysis)

        saved_analysis = existing_analysis


    # --------------------------------------------------
    # Create new analysis
    # --------------------------------------------------

    else:

        new_analysis = ScreenplayAnalysis(
            screenplay_id=screenplay.id,
            analysis_data=analysis_data
        )

        db.add(new_analysis)

        db.commit()
        db.refresh(new_analysis)

        saved_analysis = new_analysis


    # --------------------------------------------------
    # Update project status
    # --------------------------------------------------

    project.status = "analyzed"

    db.commit()


    # --------------------------------------------------
    # Return analysis
    # --------------------------------------------------

    return {
        "analysis_id": saved_analysis.id,
        "project_id": project.id,
        "screenplay_id": screenplay.id,
        "status": project.status,
        "analysis": analysis_data
    }
@router.get("/{project_id}/analysis")
def get_project_analysis(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Find project belonging to current user
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

    # Find latest screenplay
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
            detail="No screenplay uploaded for this project"
        )

    # Find saved analysis
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
            detail="No analysis found for this screenplay"
        )

    return {
        "analysis_id": saved_analysis.id,
        "project_id": project.id,
        "screenplay_id": screenplay.id,
        "status": project.status,
        "analysis": saved_analysis.analysis_data
    }