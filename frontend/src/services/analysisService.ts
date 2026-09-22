import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export interface CharacterAnalysis {
  name: string;
  age: number | string | null;
  description: string;
}

export interface SceneAnalysis {
  scene_number: number;
  scene_heading: string;
  location: string;
  time_of_day: string;
  characters_present: string[];
  props: string[];
  costumes: string[];
  vehicles: string[];
  short_scene_description: string;
}

export interface ScreenplayAnalysis {
  title: string;
  logline: string;
  total_number_of_scenes: number;
  characters: CharacterAnalysis[];
  locations: string[];
  props: string[];
  costumes: string[];
  vehicles: string[];
  scene_by_scene_breakdown: SceneAnalysis[];
}

export interface AnalyzeScreenplayResponse {
  analysis_id: number;
  project_id: number;
  screenplay_id: number;
  status: string;
  analysis: ScreenplayAnalysis;
}


// Analyze screenplay
export async function analyzeScreenplay(
  projectId: number
): Promise<ScreenplayAnalysis> {

  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Please log in again.");
  }

  const response = await axios.post<AnalyzeScreenplayResponse>(
    `${API_URL}/projects/${projectId}/analyze`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.analysis;
}


// Get saved analysis
export async function getSavedAnalysis(
  projectId: number
): Promise<ScreenplayAnalysis> {

  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Please log in again.");
  }

  const response = await axios.get<AnalyzeScreenplayResponse>(
    `${API_URL}/projects/${projectId}/analysis`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.analysis;
}