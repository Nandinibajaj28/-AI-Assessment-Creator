import { Assignment } from "../models/assignment.model";
import { assignmentQueue } from "../queues/assignment.queue";
import { processAssignmentGeneration } from "./assignment-generation.service";

const queueAssignmentGeneration = async (assignmentId: string, data: Record<string, unknown>) => {
  try {
    const job = await assignmentQueue.add("generateAssignment", {
      assignmentId,
      data,
    });
    console.log(`[AssignmentAPI] Job added to queue for assignment ${assignmentId} with job id ${job.id}`);
  } catch (queueError) {
    const message = queueError instanceof Error ? queueError.message : String(queueError);
    console.error("[AssignmentAPI] Queue add failed, generating assignment inline:", message);

    await processAssignmentGeneration(assignmentId, data);
    console.log(`[AssignmentAPI] Inline generation completed for assignment ${assignmentId}`);
  }
};

export const createAssignmentRecord = async (data: Record<string, unknown>) => {
  const assignment = await Assignment.create({
    ...data,
    status: "pending",
  });

  console.log(`[AssignmentAPI] Assignment created with pending status: ${assignment._id}`);
  await queueAssignmentGeneration(String(assignment._id), data);

  return assignment;
};

export const regenerateAssignmentRecord = async (assignmentId: string) => {
  const assignment = await Assignment.findById(assignmentId).lean();
  if (!assignment) {
    return null;
  }

  const { _id, createdAt, updatedAt, status, result, __v, ...generationData } =
    assignment as Record<string, unknown>;

  await Assignment.findByIdAndUpdate(assignmentId, {
    status: "pending",
    $unset: { result: 1, errorMessage: 1 },
  });

  await queueAssignmentGeneration(assignmentId, generationData);
  return assignmentId;
};

export const getAssignmentById = (assignmentId: string) => Assignment.findById(assignmentId);
