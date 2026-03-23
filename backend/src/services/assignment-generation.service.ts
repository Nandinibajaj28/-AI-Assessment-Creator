import { Assignment } from "../models/assignment.model";
import { generateQuestions } from "./ai.service";

export const processAssignmentGeneration = async (assignmentId: string, data: unknown) => {
  console.log(`[AssignmentGeneration] Starting generation for assignment ${assignmentId}`);
  const result = await generateQuestions(data);

  try {
    console.log(`[AssignmentGeneration] DB update started for assignment ${assignmentId}`);
    await Assignment.findByIdAndUpdate(assignmentId, {
      status: "completed",
      result
    });
    console.log(`[AssignmentGeneration] DB update completed for assignment ${assignmentId}`);
  } catch (error) {
    console.error(
      `[AssignmentGeneration] DB update failed for assignment ${assignmentId}:`,
      error instanceof Error ? error.message : String(error)
    );
  }

  return result;
};
