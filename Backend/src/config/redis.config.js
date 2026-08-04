import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const redisUrl = process.env.REDIS_URL;

let redisClient = null;

if (redisUrl) {
  redisClient = createClient({
    url: redisUrl,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 3) {
          return false; // Stop reconnecting after 3 failed attempts to avoid console spam
        }
        return Math.min(retries * 500, 2000);
      },
      tls: redisUrl.startsWith("rediss://") ? true : undefined,
    },
  });

  redisClient.on("error", (err) => {
    // Suppress repetitive error logs when Redis is offline
  });

  redisClient.on("connect", () => {
    console.log("⚡ Connected to Redis successfully!");
  });
}

const connectRedis = async () => {
  if (!redisClient) {
    console.log("ℹ️ No REDIS_URL set (or disabled). Express server operating with built-in In-Memory store.");
    return;
  }

  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.warn("⚠️ Could not connect to Redis. Automatically switched to In-Memory store fallback.");
  }
};

export { redisClient, connectRedis };
