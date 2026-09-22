import os
import uuid

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.project import Project
from app.models.screenplay import Screenplay
from app.models.screenplay_analysis import ScreenplayAnalysis
from app.models.budget import Budget
from app.models.user import User

from app.services.auth import get_current_user
from app.services.screenplay_parser import extract_pdf_text


router = APIRouter(
    prefix="/projects",
    tags=["Screenplays"]
)


UPLOAD_DIR = "uploads/screenplays"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


# ============================================================
# UPLOAD SCREENPLAY
# ============================================================

@router.post("/{project_id}/screenplay")
async def upload_screenplay(
    project_id: int,
    file: UploadFile = File(...),
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
    # Validate extension
    # --------------------------------------------------------

    allowed_extensions = {
        ".pdf",
        ".docx",
        ".txt"
    }

    extension = os.path.splitext(
        file.filename or ""
    )[1].lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=(
                "Only PDF, DOCX and TXT files "
                "are supported"
            )
        )


    # --------------------------------------------------------
    # Save file with unique filename
    # --------------------------------------------------------

    unique_filename = (
        f"{uuid.uuid4().hex}{extension}"
    )

    file_path = os.path.join(
        UPLOAD_DIR,
        unique_filename
    )

    contents = await file.read()

    with open(
        file_path,
        "wb"
    ) as buffer:
        buffer.write(contents)


    # --------------------------------------------------------
    # Extract PDF text
    # --------------------------------------------------------

    screenplay_text = None

    if extension == ".pdf":
        try:
            screenplay_text = extract_pdf_text(
                file_path
            )

            print(
                "Extracted screenplay text: "
                f"{len(screenplay_text)} characters"
            )

        except Exception as error:
            print(
                "PDF extraction failed: "
                f"{error}"
            )


    # --------------------------------------------------------
    # Save screenplay
    # --------------------------------------------------------

    screenplay = Screenplay(
        project_id=project.id,
        filename=file.filename,
        file_path=file_path,
        file_type=extension
    )

    db.add(screenplay)

    project.status = "screenplay_uploaded"

    db.commit()

    db.refresh(screenplay)


    return {
        "message": (
            "Screenplay uploaded successfully"
        ),
        "screenplay_id": screenplay.id,
        "filename": screenplay.filename,
        "project_id": project.id,
        "status": project.status,
        "text_length": (
            len(screenplay_text)
            if screenplay_text
            else 0
        )
    }


# ============================================================
# GET CURRENT SCREENPLAY
# ============================================================

@router.get("/{project_id}/screenplay")
def get_screenplay(
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


    return {
        "screenplay_id": screenplay.id,
        "project_id": project.id,
        "filename": screenplay.filename,
        "file_type": screenplay.file_type,
        "uploaded_at": screenplay.uploaded_at,
        "status": project.status
    }


# ============================================================
# DELETE SCREENPLAY
# ============================================================

@router.delete("/{project_id}/screenplay")
def delete_screenplay(
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
    # Get all screenplays
    # --------------------------------------------------------

    screenplays = (
        db.query(Screenplay)
        .filter(
            Screenplay.project_id == project.id
        )
        .all()
    )

    if not screenplays:
        raise HTTPException(
            status_code=404,
            detail="No screenplay found"
        )


    deleted_files = 0


    # --------------------------------------------------------
    # Delete screenplay data
    # --------------------------------------------------------

    for screenplay in screenplays:

        # Delete saved AI analysis
        db.query(
            ScreenplayAnalysis
        ).filter(
            ScreenplayAnalysis.screenplay_id
            == screenplay.id
        ).delete(
            synchronize_session=False
        )


        # Delete physical file
        if (
            screenplay.file_path
            and os.path.exists(
                screenplay.file_path
            )
        ):
            os.remove(
                screenplay.file_path
            )

            deleted_files += 1


        # Delete database record
        db.delete(
            screenplay
        )


    # --------------------------------------------------------
    # Delete saved budget
    # --------------------------------------------------------

    db.query(
        Budget
    ).filter(
        Budget.project_id == project.id
    ).delete(
        synchronize_session=False
    )


    # --------------------------------------------------------
    # Reset project
    # --------------------------------------------------------

    project.status = "draft"

    db.commit()


    return {
        "message": (
            "Screenplay removed successfully"
        ),
        "project_id": project.id,
        "deleted_screenplays": len(
            screenplays
        ),
        "deleted_files": deleted_files,
        "status": project.status
    }