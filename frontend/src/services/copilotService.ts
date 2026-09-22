import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export interface CopilotResponse {
  project_id: number;
  question: string;
  answer: string;
}

export async function askCopilot(
  projectId: number,
  question: string
): Promise<CopilotResponse> {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Please log in again.");
  }

  const response = await axios.post<CopilotResponse>(
    `${API_URL}/projects/${projectId}/copilot`,
    {
      question,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}