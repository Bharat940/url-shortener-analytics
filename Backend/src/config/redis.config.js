import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis successfully!");
  } catch (error) {
    console.log("Could not connect to Redis", error);
    process.exit(1);
  }
};

export { redisClient, connectRedis };
