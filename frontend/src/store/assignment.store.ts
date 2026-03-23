"use client";

import { create } from "zustand";
import { AssignmentResult } from "@/types/assignment";

type AssignmentState = {
  assignmentId: string | null;
  result: AssignmentResult | null;
  schoolName: string;
  subjectName: string;
  className: string;
  timeAllowed: string;
  setAssignmentId: (id: string | null) => void;
  setResult: (result: AssignmentResult | null) => void;
  setHeader: (header: { schoolName: string; subjectName: string; className: string; timeAllowed: string }) => void;
};

export const useAssignmentStore = create<AssignmentState>((set) => ({
  assignmentId: null,
  result: null,
  schoolName: "",
  subjectName: "",
  className: "",
  timeAllowed: "",
  setAssignmentId: (id) => set({ assignmentId: id }),
  setResult: (result) => set({ result }),
  setHeader: (header) => set({ ...header })
}));
