from pydantic import BaseModel


class CharacterAnalysis(BaseModel):
    name: str
    age: int | str | None = None
    description: str


class SceneAnalysis(BaseModel):
    scene_number: int
    scene_heading: str
    location: str
    time_of_day: str
    characters_present: list[str]
    props: list[str]
    costumes: list[str]
    vehicles: list[str]
    short_scene_description: str


class ScreenplayAnalysis(BaseModel):
    title: str
    logline: str
    total_number_of_scenes: int | None = None
    characters: list[CharacterAnalysis]
    locations: list[str]
    props: list[str]
    costumes: list[str]
    vehicles: list[str]
    scene_by_scene_breakdown: list[SceneAnalysis]