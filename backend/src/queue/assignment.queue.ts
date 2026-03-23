import { Queue, QueueEvents } from "bullmq";
import { bullRedisConfig } from "../config/redis";

export const assignmentQueue = new Queue("assignmentQueue", { connection: bullRedisConfig as any });
export const assignmentQueueEvents = new QueueEvents("assignmentQueue", { connection: bullRedisConfig as any });
