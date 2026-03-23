import axios from "axios";
import { CreateAssignmentPayload } from "@/types/assignment";

const API_BASE_URL = "http://localhost:5000";

type CreateAssignmentResponse = {
  id: string;
  message: string;
};

export const createAssignment = async (
  payload: CreateAssignmentPayload
): Promise<CreateAssignmentResponse> => {
  const response = await axios.post<CreateAssignmentResponse>(
    `${API_BASE_URL}/api/assignment`,
    payload
  );

  return response.data;
};
export const getAssignment = async (id: string): Promise<any> => {
  const response = await axios.get(`${API_BASE_URL}/api/assignment/${id}`);
  return response.data;
};
