import mongoose from "mongoose";
import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

async function testConnections() {
  console.log("Testing MongoDB...");
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("OK: MongoDB Connected");
    await mongoose.disconnect();
  } catch (err: any) {
    console.error("FAIL: MongoDB Connection Error:", err.message);
  }

  console.log("\nTesting Redis...");
  const redis = new IORedis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: 1, // Fail fast
  });

  try {
    const res = await redis.ping();
    console.log("OK: Redis PING ->", res);
  } catch (err: any) {
    console.error("FAIL: Redis Connection Error:", err.message);
  } finally {
    redis.disconnect();
  }
}

testConnections();
