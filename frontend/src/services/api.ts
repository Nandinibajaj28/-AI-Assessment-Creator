import axios from "axios";
import { AssignmentResult, CreateAssignmentPayload, DashboardAssignment } from "@/types/assignment";
import { AuthResponse } from "@/types/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useAssignmentStore } from "@/store/useAssignmentStore";

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
  subjectName?: string;
  uploadedFile?: {
    name?: string;
  };
};

export type AssignmentDetailResponse = {
  _id?: string;
  id?: string | number;
  schoolName?: string;
  subjectName?: string;
  className?: string;
  timeAllowed?: string;
  status?: string;
  errorMessage?: string;
  result?: AssignmentResult | null;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token =
    useAuthStore.getState().token ||
    (typeof window !== "undefined" ? window.localStorage.getItem("veda-auth-token") : null);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      useAuthStore.getState().clearAuth();
      useAssignmentStore.getState().resetAssignments();
      window.localStorage.removeItem("veda-auth-token");

      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

const NOISY_FILENAME_WORDS = new Set([
  "assignment",
  "chapter",
  "chap",
  "class",
  "document",
  "lesson",
  "notes",
  "pdf",
  "scan",
  "scanned",
  "worksheet",
]);

const toTitleCase = (value: string) => value.replace(/\b\w/g, (char) => char.toUpperCase());

const extractTopicFromFileName = (fileName?: string) => {
  if (!fileName) return "";

  const normalized = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return "";

  const filtered = normalized
    .split(" ")
    .filter((part) => {
      const lower = part.toLowerCase();
      return lower && !NOISY_FILENAME_WORDS.has(lower) && !/^\d+$/.test(lower);
    })
    .join(" ")
    .trim();

  return toTitleCase(filtered || normalized);
};

export function buildAssignmentTitle({
  title,
  name,
  subjectName,
  uploadedFileName,
}: {
  title?: string;
  name?: string;
  subjectName?: string;
  uploadedFileName?: string;
}) {
  const explicitTitle = title?.trim() || name?.trim();
  if (explicitTitle) return explicitTitle;

  const subject = subjectName?.trim();
  if (subject) return `Quiz on ${subject}`;

  const topic = extractTopicFromFileName(uploadedFileName);
  if (topic) return `Quiz on ${topic}`;

  return "Untitled Assignment";
}

function normalizeAssignment(item: RawAssignment, index: number): DashboardAssignment {
  return {
    id: String(item._id ?? item.id ?? index),
    title: buildAssignmentTitle({
      title: item.title,
      name: item.name,
      subjectName: item.subjectName,
      uploadedFileName: item.uploadedFile?.name,
    }),
    assignedOn: item.assignedOn ?? item.assigned_at ?? item.createdAt ?? "",
    dueDate: item.dueDate ?? item.due_date ?? item.dueAt ?? "",
    status: item.status,
  };
}

export async function getAssignments(): Promise<DashboardAssignment[]> {
  const response = await api.get("/api/assignment");
  const payload = response.data;
  const records = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];

  return records.map(normalizeAssignment);
}

export async function createAssignment(
  payload: CreateAssignmentPayload
): Promise<CreateAssignmentResponse> {
  const response = await api.post<CreateAssignmentResponse>("/api/assignment", payload);

  return response.data;
}

export async function deleteAssignment(id: string) {
  await api.delete(`/api/assignment/${id}`);
}

export async function regenerateAssignment(id: string): Promise<CreateAssignmentResponse> {
  const response = await api.post<CreateAssignmentResponse>(`/api/assignment/${id}/regenerate`);

  return response.data;
}

export async function getAssignment(id: string): Promise<AssignmentDetailResponse> {
  const response = await api.get<AssignmentDetailResponse>(`/api/assignment/${id}`);
  return response.data;
}

export async function login(payload: { email: string; password: string }): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/api/auth/login", payload);
  return response.data;
}

export async function signup(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/api/auth/signup", payload);
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get<{ user: AuthResponse["user"] }>("/api/auth/me");
  return response.data.user;
}
