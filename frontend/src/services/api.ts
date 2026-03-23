import axios from "axios";
import { CreateAssignmentPayload, DashboardAssignment } from "@/types/assignment";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type CreateAssignmentResponse = {
  id: string;
  message: string;
};

type RawAssignment = {
  _id?: string;
  id?: string | number;
  title?: string;
  name?: string;
  assignedOn?: string;
  assigned_at?: string;
  createdAt?: string;
  dueDate?: string;
  due_date?: string;
  dueAt?: string;
  status?: string;
};

function normalizeAssignment(item: RawAssignment, index: number): DashboardAssignment {
  return {
    id: String(item._id ?? item.id ?? index),
    title: item.title?.trim() || item.name?.trim() || "Quiz on Electricity",
    assignedOn: item.assignedOn ?? item.assigned_at ?? item.createdAt ?? "",
    dueDate: item.dueDate ?? item.due_date ?? item.dueAt ?? "",
    status: item.status,
  };
}

export async function getAssignments(): Promise<DashboardAssignment[]> {
  const response = await axios.get(`${API_BASE_URL}/api/assignment`);
  const payload = response.data;
  const records = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];

  return records.map(normalizeAssignment);
}

export async function createAssignment(
  payload: CreateAssignmentPayload
): Promise<CreateAssignmentResponse> {
  const response = await axios.post<CreateAssignmentResponse>(
    `${API_BASE_URL}/api/assignment`,
    payload
  );

  return response.data;
}

export async function deleteAssignment(id: string) {
  await axios.delete(`${API_BASE_URL}/api/assignment/${id}`);
}

export async function regenerateAssignment(id: string): Promise<CreateAssignmentResponse> {
  const response = await axios.post<CreateAssignmentResponse>(
    `${API_BASE_URL}/api/assignment/${id}/regenerate`
  );

  return response.data;
}

export async function getAssignment(id: string): Promise<any> {
  const response = await axios.get(`${API_BASE_URL}/api/assignment/${id}`);
  return response.data;
}
