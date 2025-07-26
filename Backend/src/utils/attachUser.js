import { verifyToken } from "./helper.js";
import { findUserById } from "../dao/user.js";

export const attachUser = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) return next();

  try {
    const userId = verifyToken(token);
    const user = await findUserById(userId);

    if (!user) return next();

    req.user = user;
  } catch (err) {
    console.error("Invalid token:", err.message);
  }
  next();
};
