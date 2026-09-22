import json

from google import genai
from google.genai import errors

from app.core.config import settings


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
]


def ask_copilot(
    question: str,
    analysis: dict,
    budget: dict | None = None,
    schedule: dict | None = None,
) -> str:

    context = {
        "screenplay_analysis": analysis,
        "budget": budget or {},
        "shooting_schedule": schedule or {}
    }

    prompt = f"""
You are an AI production assistant for a film production planning
application.

Answer the user's question using ONLY the production information
provided below.

PROJECT PRODUCTION DATA:
{json.dumps(context, indent=2, default=str)}

USER QUESTION:
{question}

Instructions:

1. Give a direct and useful answer.
2. Use the actual project data whenever possible.
3. Do not invent scenes, characters, costs, locations, or schedule data.
4. If the requested information is not available, clearly say so.
5. When discussing budget, use the provided calculated values.
6. When discussing scheduling, use the provided shooting schedule.
7. Keep the answer concise but informative.
8. You may provide bullet points when useful.
"""

    last_error = None

    for model_name in MODELS:

        print(
            f"Trying Copilot Gemini model: {model_name}"
        )

        try:

            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )

            if (
                response is None
                or not response.text
            ):
                raise ValueError(
                    "Gemini returned an empty response."
                )

            return response.text.strip()

        except errors.ServerError as error:

            last_error = error

            print(
                f"Copilot Gemini server error "
                f"using {model_name}: {error}"
            )

        except errors.ClientError as error:

            last_error = error

            print(
                f"Copilot Gemini client error "
                f"using {model_name}: {error}"
            )

            # Try fallback model
            continue

        except Exception as error:

            last_error = error

            print(
                f"Copilot error using "
                f"{model_name}: {error}"
            )

            continue

    raise RuntimeError(
        "All configured Copilot Gemini models failed. "
        f"Last error: {last_error}"
    )