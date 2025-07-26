import { redisClient } from "../config/redis.config.js";
import { AppError } from "../utils/errorHandler.js";

const ANONYMOUS_URL_LIMIT = 10;
const EXPIRATION_IN_SECONDS = 3600;

export const anonymousRateLimiter = async (req, res, next) => {
  if (req.user) {
    return next();
  }

  const ip = req.ip;

  try {
    const requests = await redisClient.incr(ip);

    if (requests === 1) {
      await redisClient.expire(ip, EXPIRATION_IN_SECONDS);
    }

    if (requests > ANONYMOUS_URL_LIMIT) {
      throw new AppError(
        `You have reached your limit of ${ANONYMOUS_URL_LIMIT} creations per hour. Please log in for unlimited use.`,
        429
      );
    }

    next();
  } catch (err) {
    next(err);
  }
};
