from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func

from app.database.database import Base


class ScreenplayAnalysis(Base):
    __tablename__ = "screenplay_analyses"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    screenplay_id = Column(
        Integer,
        ForeignKey("screenplays.id"),
        nullable=False,
        unique=True,
        index=True
    )

    analysis_data = Column(
        JSONB,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )