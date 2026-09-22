import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export interface BudgetData {
  crew_cost: number;
  equipment_cost: number;
  location_cost: number;
  props_cost: number;
  costumes_cost: number;
  transport_cost: number;
  contingency_cost: number;
  total_cost: number;
}

export interface BudgetResponse {
  budget_id: number;
  project_id: number;
  status: string;
  budget: BudgetData;
}

export async function generateBudget(
  projectId: number
): Promise<BudgetResponse> {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Please log in again.");
  }

  const response = await axios.post<BudgetResponse>(
    `${API_URL}/projects/${projectId}/budget`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function getSavedBudget(
  projectId: number
): Promise<BudgetResponse> {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Please log in again.");
  }

  const response = await axios.get<BudgetResponse>(
    `${API_URL}/projects/${projectId}/budget`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}