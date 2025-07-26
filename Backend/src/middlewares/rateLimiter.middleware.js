import { redisClient } from "../config/redis.config.js";
import { AppError } from "../utils/errorHandler.js";

const ANONYMOUS_URL_LIMIT = parseInt(process.env.ANONYMOUS_URL_LIMIT, 10) || 20;
const EXPIRATION_IN_SECONDS =
  parseInt(process.env.ANONYMOUS_EXPIRATION_SECONDS, 10) || 24 * 60 * 60;

export const anonymousRateLimiter = async (req, res, next) => {
  if (req.user) {
    return next();
  }

  const ip = req.ip || "unknown-ip";
  const userAgent = req.headers["user-agent"] || "unknown-agent";
  const key = `anon:${ip}:${userAgent}`;

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

    next();
  } catch (err) {
    next(err);
  }
};
