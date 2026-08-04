import { redisClient } from "../config/redis.config.js";
import { AppError } from "../utils/errorHandler.js";

const ANONYMOUS_URL_LIMIT = parseInt(process.env.ANONYMOUS_URL_LIMIT, 10) || 20;
const EXPIRATION_IN_SECONDS =
  parseInt(process.env.ANONYMOUS_EXPIRATION_SECONDS, 10) || 24 * 60 * 60;

// In-Memory Rate Limiting Fallback Store (No external Redis required!)
const memoryStore = new Map();

// Cleanup expired in-memory entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of memoryStore.entries()) {
    if (now > record.resetTime) {
      memoryStore.delete(key);
    }
  }
}, 60 * 60 * 1000);

export const anonymousRateLimiter = async (req, res, next) => {
  if (req.user) {
    return next();
  }

  const ip = req.ip || "unknown-ip";
  const userAgent = req.headers["user-agent"] || "unknown-agent";
  const key = `anon:${ip}:${userAgent}`;

  // MODE A: Try Redis if connected and ready
  if (redisClient && redisClient.isOpen && redisClient.isReady) {
    try {
      const requests = await redisClient.incr(key);

      if (requests === 1) {
        await redisClient.expire(key, EXPIRATION_IN_SECONDS);
      }

      if (requests > ANONYMOUS_URL_LIMIT) {
        throw new AppError(
          `You have reached your limit of ${ANONYMOUS_URL_LIMIT} combined URL and QR code creations per day. Please register or log in for unlimited access.`,
          429
        );
      }

      return next();
    } catch (err) {
      if (err instanceof AppError) return next(err);
      console.warn("⚠️ Redis temporary error, falling back to In-Memory store.");
    }
  }

  // MODE B: Automatic In-Memory Rate Limiting (Works on Render without any Redis service!)
  const now = Date.now();
  let record = memoryStore.get(key);

  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + EXPIRATION_IN_SECONDS * 1000,
    };
  } else {
    record.count += 1;
  }

  memoryStore.set(key, record);

  if (record.count > ANONYMOUS_URL_LIMIT) {
    return next(
      new AppError(
        `You have reached your limit of ${ANONYMOUS_URL_LIMIT} combined URL and QR code creations per day. Please register or log in for unlimited access.`,
        429
      )
    );
  }

  next();
};
