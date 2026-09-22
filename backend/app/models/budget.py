from sqlalchemy import Column, Integer, Numeric, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database.database import Base


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False,
        unique=True,
        index=True
    )

    crew_cost = Column(
        Numeric(12, 2),
        nullable=False,
        default=0
    )

    equipment_cost = Column(
        Numeric(12, 2),
        nullable=False,
        default=0
    )

    location_cost = Column(
        Numeric(12, 2),
        nullable=False,
        default=0
    )

    props_cost = Column(
        Numeric(12, 2),
        nullable=False,
        default=0
    )

    costumes_cost = Column(
        Numeric(12, 2),
        nullable=False,
        default=0
    )

    transport_cost = Column(
        Numeric(12, 2),
        nullable=False,
        default=0
    )

    contingency_cost = Column(
        Numeric(12, 2),
        nullable=False,
        default=0
    )

    total_cost = Column(
        Numeric(12, 2),
        nullable=False,
        default=0
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