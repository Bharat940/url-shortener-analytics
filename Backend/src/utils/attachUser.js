import { verifyToken } from "../utils/helper.js";
import { findUserById } from "../dao/user.js";

export const attachUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    const userId = verifyToken(token);
    const user = await findUserById(userId);

    if (user) {
      req.user = user;
    }
  } catch (err) {
    console.error("Invalid token:", err.message);
  }
  next();
};
