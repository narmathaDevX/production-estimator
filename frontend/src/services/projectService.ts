import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export interface Project {
  id: number;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
}

export async function createProject(
  data: CreateProjectData
): Promise<Project> {
  const token = localStorage.getItem("access_token");

  const response = await axios.post<Project>(
    `${API_URL}/projects`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function getProjects(): Promise<Project[]> {
  const token = localStorage.getItem("access_token");

  const response = await axios.get<Project[]>(
    `${API_URL}/projects`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}