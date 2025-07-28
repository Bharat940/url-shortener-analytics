import { verifyToken } from "../utils/helper.js";
import { findUserById } from "../dao/user.js";
import { UnauthorizedError } from "../utils/errorHandler.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) throw new UnauthorizedError("Access denied, no token provided.");

  try {
    const userId = verifyToken(token);
    const user = await findUserById(userId);
    if (!user) throw new UnauthorizedError("User not found or unauthorized");
    req.user = user;
    next();
  } catch (err) {
    next(new UnauthorizedError("Invalid or expired token"));
  }
};
