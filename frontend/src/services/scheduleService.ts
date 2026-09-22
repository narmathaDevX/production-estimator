import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export interface ScheduledScene {
  scene_number: number;
  scene_heading: string;
  time_of_day: string;
  characters: string[];
  props: string[];
  costumes: string[];
  vehicles: string[];
  description: string;
}

export interface ShootingDay {
  day: number;
  location: string;
  scene_count: number;
  scenes: ScheduledScene[];
}

export interface ShootingSchedule {
  total_shooting_days: number;
  shooting_days: ShootingDay[];
}

export interface ScheduleResponse {
  schedule_id: number;
  project_id: number;
  status: string;
  schedule: ShootingSchedule;
}

export async function generateSchedule(
  projectId: number
): Promise<ScheduleResponse> {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Please log in again.");
  }

  const response = await axios.post<ScheduleResponse>(
    `${API_URL}/projects/${projectId}/schedule`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function getSavedSchedule(
  projectId: number
): Promise<ScheduleResponse> {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Please log in again.");
  }

  const response = await axios.get<ScheduleResponse>(
    `${API_URL}/projects/${projectId}/schedule`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}