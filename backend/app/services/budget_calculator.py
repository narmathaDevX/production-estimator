from decimal import Decimal

from app.schemas.analysis import ScreenplayAnalysis


# ---------------------------------------------------------
# Default production rates
# ---------------------------------------------------------

CREW_RATE_PER_SCENE = Decimal("15000")
EQUIPMENT_RATE_PER_SCENE = Decimal("8000")
LOCATION_RATE = Decimal("10000")
PROP_RATE = Decimal("2500")
COSTUME_RATE = Decimal("3000")
TRANSPORT_RATE_PER_SCENE = Decimal("5000")

CONTINGENCY_PERCENTAGE = Decimal("0.10")


def calculate_budget(
    analysis: ScreenplayAnalysis
):
    """
    Calculate a deterministic production budget
    from screenplay analysis.

    Gemini is NOT used for the calculations.
    """

    # -----------------------------------------------------
    # Basic counts
    # -----------------------------------------------------

    scene_count = (
        analysis.total_number_of_scenes or
        len(analysis.scene_by_scene_breakdown)
    )

    location_count = len(
        analysis.locations
    )

    prop_count = len(
        analysis.props
    )

    costume_count = len(
        analysis.costumes
    )


    # -----------------------------------------------------
    # Crew cost
    # -----------------------------------------------------

    crew_cost = (
        Decimal(scene_count)
        * CREW_RATE_PER_SCENE
    )


    # -----------------------------------------------------
    # Equipment cost
    # -----------------------------------------------------

    equipment_cost = (
        Decimal(scene_count)
        * EQUIPMENT_RATE_PER_SCENE
    )


    # -----------------------------------------------------
    # Location cost
    # -----------------------------------------------------

    location_cost = (
        Decimal(location_count)
        * LOCATION_RATE
    )


    # -----------------------------------------------------
    # Props cost
    # -----------------------------------------------------

    props_cost = (
        Decimal(prop_count)
        * PROP_RATE
    )


    # -----------------------------------------------------
    # Costume cost
    # -----------------------------------------------------

    costumes_cost = (
        Decimal(costume_count)
        * COSTUME_RATE
    )


    # -----------------------------------------------------
    # Transport cost
    # -----------------------------------------------------

    transport_cost = (
        Decimal(scene_count)
        * TRANSPORT_RATE_PER_SCENE
    )


    # -----------------------------------------------------
    # Subtotal
    # -----------------------------------------------------

    subtotal = (
        crew_cost
        + equipment_cost
        + location_cost
        + props_cost
        + costumes_cost
        + transport_cost
    )


    # -----------------------------------------------------
    # Contingency
    # -----------------------------------------------------

    contingency_cost = (
        subtotal
        * CONTINGENCY_PERCENTAGE
    )


    # -----------------------------------------------------
    # Total
    # -----------------------------------------------------

    total_cost = (
        subtotal
        + contingency_cost
    )


    return {
        "crew_cost": crew_cost,
        "equipment_cost": equipment_cost,
        "location_cost": location_cost,
        "props_cost": props_cost,
        "costumes_cost": costumes_cost,
        "transport_cost": transport_cost,
        "contingency_cost": contingency_cost,
        "total_cost": total_cost,
    }