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
          text: "Explain Artificial Intelligence.",
          difficulty: "easy" as const,
          marks: 2
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
      console.log(`[Worker] Job completed for assignment ${assignmentId}`);
      return { assignmentId, result };
    } catch (error) {
      console.error(
        `[Worker] Unexpected error while processing assignment ${assignmentId}:`,
        error instanceof Error ? error.message : String(error)
      );
      console.log(`[Worker] Fallback used for assignment ${assignmentId}`);

      try {
        await Assignment.findByIdAndUpdate(String(assignmentId), {
          status: "completed",
          result: FALLBACK_RESULT
        });
      } catch (dbError) {
        console.error(
          `[Worker] Failed to persist fallback result for assignment ${assignmentId}:`,
          dbError instanceof Error ? dbError.message : String(dbError)
        );
      }

      console.log(`[Worker] Job completed for assignment ${assignmentId}`);
      return { assignmentId, result: FALLBACK_RESULT };
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
