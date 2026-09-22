from collections import defaultdict

from app.schemas.analysis import ScreenplayAnalysis


def generate_shooting_schedule(
    analysis: ScreenplayAnalysis
):
    """
    Generate a deterministic shooting schedule.

    Scenes are grouped primarily by location so that
    production can minimize unnecessary location changes.
    """

    scenes = analysis.scene_by_scene_breakdown

    if not scenes:
        return {
            "total_shooting_days": 0,
            "shooting_days": []
        }

    # --------------------------------------------------------
    # Group scenes by location
    # --------------------------------------------------------

    location_groups = defaultdict(list)

    for scene in scenes:

        location = (
            scene.location.strip()
            if scene.location
            else "Unknown Location"
        )

        location_groups[location].append(
            scene
        )


    # --------------------------------------------------------
    # Sort scenes inside each location
    # --------------------------------------------------------

    for location in location_groups:

        location_groups[location].sort(
            key=lambda scene: scene.scene_number
        )


    # --------------------------------------------------------
    # Create shooting days
    #
    # For the MVP, each location becomes one shooting day.
    # --------------------------------------------------------

    shooting_days = []

    day_number = 1

    for location, location_scenes in (
        location_groups.items()
    ):

        scenes_data = []

        for scene in location_scenes:

            scenes_data.append({
                "scene_number": (
                    scene.scene_number
                ),
                "scene_heading": (
                    scene.scene_heading
                ),
                "time_of_day": (
                    scene.time_of_day
                ),
                "characters": (
                    scene.characters_present
                ),
                "props": (
                    scene.props
                ),
                "costumes": (
                    scene.costumes
                ),
                "vehicles": (
                    scene.vehicles
                ),
                "description": (
                    scene.short_scene_description
                )
            })


        shooting_days.append({
            "day": day_number,
            "location": location,
            "scene_count": len(
                location_scenes
            ),
            "scenes": scenes_data
        })

        day_number += 1


    return {
        "total_shooting_days": len(
            shooting_days
        ),
        "shooting_days": shooting_days
    }
