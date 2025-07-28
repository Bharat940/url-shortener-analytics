import {
  registerUserService,
  loginUserService,
} from "../services/auth.service.js";
import wrapAsync from "../utils/tryCatchWraper.js";

export const registerUser = wrapAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, token } = await registerUserService(name, email, password);
  res
    .status(201)
    .json({ message: "User registered successfully", token, user });
});

export const loginUser = wrapAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await loginUserService(email, password);
  res.status(200).json({ message: "User logged in successfully", token, user });
});

export const logoutUser = wrapAsync(async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

export const getCurrentUser = wrapAsync(async (req, res) => {
  res.status(200).json({ user: req.user });
});
