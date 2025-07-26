import { verifyToken } from "../utils/helper.js";
import { findUserById } from "../dao/user.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided." });
  }

  try {
    const userId = verifyToken(token);
    const user = await findUserById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token." });
  }
};
