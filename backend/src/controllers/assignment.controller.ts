import { Request, Response } from "express";
import { Assignment } from "../models/assignment.model";
import { assignmentQueue } from "../queue/assignment.queue";
import { processAssignmentGeneration } from "../services/assignment-generation.service";

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    console.log("[AssignmentAPI] Create assignment API hit");

    const assignment = await Assignment.create({
      ...data,
      status: "pending"
    });

    console.log(`[AssignmentAPI] Assignment created with pending status: ${assignment._id}`);

    try {
      const job = await assignmentQueue.add("generateAssignment", {
        assignmentId: assignment._id,
        data
      });
      console.log(
        `[AssignmentAPI] Job added to queue for assignment ${assignment._id} with job id ${job.id}`
      );
    } catch (queueError) {
      const message = queueError instanceof Error ? queueError.message : String(queueError);
      console.error("[AssignmentAPI] Queue add failed, generating assignment inline:", message);

      await processAssignmentGeneration(String(assignment._id), data);
      console.log(`[AssignmentAPI] Inline generation completed for assignment ${assignment._id}`);
    }

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
