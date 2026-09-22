import axios from "axios";

const API_URL = "http://127.0.0.1:8000";


export interface ScreenplayUploadResponse {
  message: string;
  screenplay_id: number;
  filename: string;
  project_id: number;
  status: string;
  text_length: number;
}


export interface DeleteScreenplayResponse {
  message: string;
  project_id: number;
  deleted_screenplays: number;
  deleted_files: number;
  status: string;
}


/*
 * Upload screenplay
 */
export async function uploadScreenplay(
  projectId: number,
  file: File
): Promise<ScreenplayUploadResponse> {

  const token =
    localStorage.getItem(
      "access_token"
    );

  if (!token) {
    throw new Error(
      "Please log in again."
    );
  }


  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );


  const response =
    await axios.post<ScreenplayUploadResponse>(
      `${API_URL}/projects/${projectId}/screenplay`,
      formData,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );


  return response.data;
}


/*
 * Remove screenplay
 */
export async function deleteScreenplay(
  projectId: number
): Promise<DeleteScreenplayResponse> {

  const token =
    localStorage.getItem(
      "access_token"
    );

  if (!token) {
    throw new Error(
      "Please log in again."
    );
  }


  const response =
    await axios.delete<DeleteScreenplayResponse>(
      `${API_URL}/projects/${projectId}/screenplay`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );


  return response.data;
}