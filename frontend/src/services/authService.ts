import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  full_name: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}


// Register
export async function registerUser(
  data: RegisterData
): Promise<User> {
  const response = await axios.post<User>(
    `${API_URL}/auth/register`,
    data
  );

  return response.data;
}


// Login
export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(
    `${API_URL}/auth/login`,
    null,
    {
      params: {
        email,
        password,
      },
    }
  );

  return response.data;
}


// Get currently logged-in user
export async function getCurrentUser(
  token: string
): Promise<User> {
  const response = await axios.get<User>(
    `${API_URL}/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}