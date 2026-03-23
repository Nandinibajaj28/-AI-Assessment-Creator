import { Request, Response } from "express";
import {
  createAssignmentRecord,
  getAssignmentById,
  regenerateAssignmentRecord,
} from "../services/assignment.service";

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const data = req.body as Record<string, unknown>;
    console.log("[AssignmentAPI] Create assignment API hit");

    const assignment = await createAssignmentRecord(data);

    res.json({
      message: "Assignment creation started",
      id: assignment._id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[AssignmentAPI] Failed to create assignment:", message);
    res.status(500).json({ error: "Server error" });
  }
};

export const regenerateAssignment = async (req: Request, res: Response) => {
  try {
    const assignmentId = String(req.params.id);
    const regeneratedAssignmentId = await regenerateAssignmentRecord(assignmentId);

    if (!regeneratedAssignmentId) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    return res.json({
      message: "Assignment regeneration started",
      id: regeneratedAssignmentId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[AssignmentAPI] Failed to regenerate assignment:", message);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await getAssignmentById(String(req.params.id));
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
