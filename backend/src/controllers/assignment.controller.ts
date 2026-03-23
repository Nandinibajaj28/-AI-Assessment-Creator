import { Request, Response } from "express";
import { Assignment } from "../models/assignment.model";
import { assignmentQueue } from "../queue/assignment.queue";
import { processAssignmentGeneration } from "../services/assignment-generation.service";

const queueAssignmentGeneration = async (assignmentId: string, data: Record<string, unknown>) => {
  try {
    const job = await assignmentQueue.add("generateAssignment", {
      assignmentId,
      data
    });
    console.log(`[AssignmentAPI] Job added to queue for assignment ${assignmentId} with job id ${job.id}`);
  } catch (queueError) {
    const message = queueError instanceof Error ? queueError.message : String(queueError);
    console.error("[AssignmentAPI] Queue add failed, generating assignment inline:", message);

    await processAssignmentGeneration(assignmentId, data);
    console.log(`[AssignmentAPI] Inline generation completed for assignment ${assignmentId}`);
  }
};

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const data = req.body as Record<string, unknown>;
    console.log("[AssignmentAPI] Create assignment API hit");

    const assignment = await Assignment.create({
      ...data,
      status: "pending"
    });

    console.log(`[AssignmentAPI] Assignment created with pending status: ${assignment._id}`);
    await queueAssignmentGeneration(String(assignment._id), data);

    res.json({
      message: "Assignment creation started",
      id: assignment._id
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
    const assignment = await Assignment.findById(assignmentId).lean();
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    const {
      _id,
      createdAt,
      updatedAt,
      status,
      result,
      __v,
      ...generationData
    } = assignment as Record<string, unknown>;

    await Assignment.findByIdAndUpdate(assignmentId, {
      status: "pending",
      $unset: { result: 1, errorMessage: 1 }
    });

    await queueAssignmentGeneration(assignmentId, generationData);

    return res.json({
      message: "Assignment regeneration started",
      id: assignmentId
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[AssignmentAPI] Failed to regenerate assignment:", message);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
