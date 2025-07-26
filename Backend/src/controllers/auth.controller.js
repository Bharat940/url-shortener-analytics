import {
  registerUserService,
  loginUserService,
} from "../services/auth.service.js";
import wrapAsync from "../utils/tryCatchWraper.js";
import { cookieOptions } from "../config/config.js";

export const registerUser = wrapAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, token } = await registerUserService(name, email, password);

  req.user = user;
  res.cookie("accessToken", token, cookieOptions);
  res
    .status(201)
    .json({ message: "User registered successfully", token: token });
});

export const loginUser = wrapAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await loginUserService(email, password);
  req.user = user;
  res.cookie("accessToken", token, cookieOptions);
  res
    .status(200)
    .json({ user: user, message: "User logged in successfully", token: token });
});

export const logoutUser = wrapAsync(async (req, res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.status(200).json({ message: "User logged out successfully" });
});

export const getCurrentUser = wrapAsync(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.status(200).json({ user: req.user });
});
