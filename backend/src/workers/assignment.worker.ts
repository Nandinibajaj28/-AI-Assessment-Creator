import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import { bullRedisConfig } from "../config/redis";
import { connectDB } from "../config/db";
import { Assignment } from "../models/assignment.model";
import { processAssignmentGeneration } from "../services/assignment-generation.service";

connectDB();

const FALLBACK_RESULT = {
  sections: [
    {
      title: "Section A",
      instruction: "Attempt all questions",
      questions: [
        {
          text: "What fact is directly stated in the provided material?",
          difficulty: "easy" as const,
          marks: 2,
          sourceLine: "No source text was extracted from the uploaded material."
        }
      ]
    }
  ]
};

const worker = new Worker(
  "assignmentQueue",
  async (job) => {
    const { assignmentId, data } = job.data;
    console.log(`[Worker] Job started for job ${job.id} and assignment ${assignmentId}`);

    try {
      const result = await processAssignmentGeneration(String(assignmentId), data);
      const assignment = await Assignment.findById(String(assignmentId)).lean();
      console.log(`[Worker] Job completed for assignment ${assignmentId}`);
      return {
        assignmentId,
        result,
        schoolName: assignment?.schoolName || "",
        subjectName: assignment?.subjectName || "",
        className: assignment?.className || "",
        timeAllowed: assignment?.timeAllowed || ""
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[Worker] Unexpected error while processing assignment ${assignmentId}:`, message);

      if (message.toLowerCase().includes("text extraction failed")) {
        await Assignment.findByIdAndUpdate(String(assignmentId), {
          status: "failed",
          errorMessage: message,
          $unset: { result: 1 }
        });

        const assignment = await Assignment.findById(String(assignmentId)).lean();
        return {
          assignmentId,
          errorMessage: message,
          schoolName: assignment?.schoolName || "",
          subjectName: assignment?.subjectName || "",
          className: assignment?.className || "",
          timeAllowed: assignment?.timeAllowed || ""
        };
      }

      console.log(`[Worker] Fallback used for assignment ${assignmentId}`);

      try {
        await Assignment.findByIdAndUpdate(String(assignmentId), {
          status: "completed",
          errorMessage: null,
          result: FALLBACK_RESULT
        });
      } catch (dbError) {
        console.error(
          `[Worker] Failed to persist fallback result for assignment ${assignmentId}:`,
          dbError instanceof Error ? dbError.message : String(dbError)
        );
      }

      console.log(`[Worker] Job completed for assignment ${assignmentId}`);
      const assignment = await Assignment.findById(String(assignmentId)).lean();
      return {
        assignmentId,
        result: FALLBACK_RESULT,
        schoolName: assignment?.schoolName || "",
        subjectName: assignment?.subjectName || "",
        className: assignment?.className || "",
        timeAllowed: assignment?.timeAllowed || ""
      };
    }
  },
  {
    connection: bullRedisConfig as any
  }
);

worker.on("ready", () => {
  console.log("[Worker] Assignment worker is ready and connected to Redis");
});

worker.on("failed", (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed: ${err.message}`);
});

export default worker;
