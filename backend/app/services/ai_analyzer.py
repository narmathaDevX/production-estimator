import json
import time

from google import genai
from google.genai import errors

from app.core.config import settings
from app.schemas.analysis import ScreenplayAnalysis


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


# Free-friendly model order.
# We try the primary model first and use the
# fallback only if the primary is unavailable.
MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
]


def clean_json_response(text: str) -> str:
    """
    Remove markdown code fences if Gemini returns them.
    """

    cleaned = text.strip()

    if cleaned.startswith("```"):
        cleaned = cleaned.replace(
            "```json",
            "",
            1
        )

        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]

        cleaned = cleaned.strip()

    return cleaned


def normalize_analysis_data(data: dict) -> dict:

    field_mapping = {
        "Title": "title",
        "Logline": "logline",
        "Total_Number_of_Scenes":
            "total_number_of_scenes",
        "Total Number of Scenes":
            "total_number_of_scenes",
        "TotalNumberOfScenes":
            "total_number_of_scenes",
        "Characters": "characters",
        "Locations": "locations",
        "Props": "props",
        "Costumes": "costumes",
        "Vehicles": "vehicles",
        "Scene_by_Scene_Breakdown":
            "scene_by_scene_breakdown",
        "Scene-by-Scene Breakdown":
            "scene_by_scene_breakdown",
        "Scene Breakdown":
            "scene_by_scene_breakdown",
    }

    for old_key, new_key in field_mapping.items():

        if (
            old_key in data
            and new_key not in data
        ):
            data[new_key] = data.pop(old_key)


    data.setdefault(
        "title",
        "Untitled Screenplay"
    )

    data.setdefault(
        "logline",
        ""
    )

    data.setdefault(
        "total_number_of_scenes",
        None
    )

    data.setdefault(
        "characters",
        []
    )

    data.setdefault(
        "locations",
        []
    )

    data.setdefault(
        "props",
        []
    )

    data.setdefault(
        "costumes",
        []
    )

    data.setdefault(
        "vehicles",
        []
    )

    data.setdefault(
        "scene_by_scene_breakdown",
        []
    )


    # --------------------------------------------------------
    # Normalize characters
    # --------------------------------------------------------

    normalized_characters = []

    for character in data.get(
        "characters",
        []
    ):

        if isinstance(
            character,
            str
        ):

            normalized_characters.append({
                "name": character,
                "age": None,
                "description": ""
            })

        elif isinstance(
            character,
            dict
        ):

            normalized_characters.append({
                "name": character.get(
                    "name",
                    character.get(
                        "Name",
                        "Unknown"
                    )
                ),

                "age": character.get(
                    "age",
                    character.get(
                        "Age",
                        None
                    )
                ),

                "description": character.get(
                    "description",
                    character.get(
                        "Description",
                        ""
                    )
                )
            })


    data["characters"] = (
        normalized_characters
    )


    # --------------------------------------------------------
    # Normalize scenes
    # --------------------------------------------------------

    normalized_scenes = []

    for index, scene in enumerate(
        data.get(
            "scene_by_scene_breakdown",
            []
        ),
        start=1
    ):

        if not isinstance(
            scene,
            dict
        ):
            continue


        normalized_scene = {
            "scene_number": scene.get(
                "scene_number",
                scene.get(
                    "Scene_Number",
                    index
                )
            ),

            "scene_heading": scene.get(
                "scene_heading",
                scene.get(
                    "Scene_Heading",
                    scene.get(
                        "Scene Heading",
                        ""
                    )
                )
            ),

            "location": scene.get(
                "location",
                scene.get(
                    "Location",
                    ""
                )
            ),

            "time_of_day": scene.get(
                "time_of_day",
                scene.get(
                    "Time_of_Day",
                    scene.get(
                        "Time of Day",
                        ""
                    )
                )
            ),

            "characters_present": scene.get(
                "characters_present",
                scene.get(
                    "Characters_Present",
                    scene.get(
                        "Characters Present",
                        []
                    )
                )
            ),

            "props": scene.get(
                "props",
                scene.get(
                    "Props",
                    []
                )
            ),

            "costumes": scene.get(
                "costumes",
                scene.get(
                    "Costumes",
                    []
                )
            ),

            "vehicles": scene.get(
                "vehicles",
                scene.get(
                    "Vehicles",
                    []
                )
            ),

            "short_scene_description": scene.get(
                "short_scene_description",
                scene.get(
                    "Short_Scene_Description",
                    scene.get(
                        "Short Scene Description",
                        ""
                    )
                )
            )
        }

        normalized_scenes.append(
            normalized_scene
        )


    data["scene_by_scene_breakdown"] = (
        normalized_scenes
    )


    # Calculate scene count if Gemini
    # didn't provide it.

    if not data.get(
        "total_number_of_scenes"
    ):

        data["total_number_of_scenes"] = len(
            data.get(
                "scene_by_scene_breakdown",
                []
            )
        )


    return data


def analyze_screenplay(
    screenplay_text: str
):
    """
    Analyze a screenplay using Gemini.

    Gemini performs semantic screenplay
    understanding.

    Budget calculations are handled separately
    by the deterministic Python budget engine.
    """

    prompt = f"""
You are an expert film production analyst.

Analyze the following screenplay and return a
structured production analysis.

SCREENPLAY:

{screenplay_text}

Identify:

1. Title
2. Logline
3. Total number of scenes
4. Characters
5. Locations
6. Props
7. Costumes
8. Vehicles
9. Scene-by-scene breakdown

For every character provide:

- name
- age if mentioned
- description

For every scene provide:

- scene number
- scene heading
- location
- time of day
- characters present
- props
- costumes
- vehicles
- short scene description

IMPORTANT:

Return ONLY valid JSON.

Do not include markdown.

Use EXACTLY these field names:

{{
    "title": "...",
    "logline": "...",
    "total_number_of_scenes": 0,
    "characters": [],
    "locations": [],
    "props": [],
    "costumes": [],
    "vehicles": [],
    "scene_by_scene_breakdown": []
}}

For characters use:

{{
    "name": "...",
    "age": null,
    "description": "..."
}}

For scenes use:

{{
    "scene_number": 1,
    "scene_heading": "...",
    "location": "...",
    "time_of_day": "...",
    "characters_present": [],
    "props": [],
    "costumes": [],
    "vehicles": [],
    "short_scene_description": "..."
}}

Be comprehensive.

Do not omit production-relevant details.
"""


    last_error = None


    # --------------------------------------------------------
    # Try available models
    # --------------------------------------------------------

    for model_name in MODELS:

        print(
            f"\nTrying Gemini model: "
            f"{model_name}"
        )


        for attempt in range(3):

            try:

                response = (
                    client.models.generate_content(
                        model=model_name,
                        contents=prompt,
                    )
                )


                if (
                    response is None
                    or not response.text
                ):

                    raise ValueError(
                        "Gemini returned an empty response."
                    )


                cleaned_response = (
                    clean_json_response(
                        response.text
                    )
                )


                try:

                    data = json.loads(
                        cleaned_response
                    )

                except json.JSONDecodeError as error:

                    print(
                        "\n===== INVALID GEMINI JSON ====="
                    )

                    print(
                        cleaned_response
                    )

                    print(
                        "================================\n"
                    )

                    raise ValueError(
                        "Gemini returned invalid JSON: "
                        f"{error}"
                    )


                # Normalize Gemini output

                data = normalize_analysis_data(
                    data
                )


                # Validate using Pydantic

                try:

                    analysis = (
                        ScreenplayAnalysis
                        .model_validate(data)
                    )

                except Exception as error:

                    print(
                        "\n===== PYDANTIC VALIDATION ERROR ====="
                    )

                    print(error)

                    print(
                        "\n===== GEMINI DATA ====="
                    )

                    print(
                        json.dumps(
                            data,
                            indent=2
                        )
                    )

                    print(
                        "=====================================\n"
                    )

                    raise


                print(
                    f"Gemini analysis succeeded "
                    f"using {model_name}"
                )


                return analysis


            except errors.ServerError as error:

                last_error = error

                print(
                    f"Gemini server error "
                    f"using {model_name}."
                )

                if attempt < 2:

                    wait_time = (
                        5 * (attempt + 1)
                    )

                    print(
                        f"Retrying in "
                        f"{wait_time} seconds..."
                    )

                    time.sleep(
                        wait_time
                    )


            except errors.ClientError as error:

                last_error = error

                print(
                    f"Gemini client error "
                    f"using {model_name}: "
                    f"{error}"
                )

                # Don't waste retries on a
                # model that is unavailable
                # or quota limited.

                break


            except Exception as error:

                last_error = error

                print(
                    f"Gemini analysis error "
                    f"using {model_name}: "
                    f"{error}"
                )

                break


    raise RuntimeError(
        "All configured Gemini models "
        "failed. Last error: "
        f"{last_error}"
    )