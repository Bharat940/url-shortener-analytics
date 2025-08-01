import {
  findUserByEmail,
  createUser,
  findUserByEmailByPassword,
} from "../dao/user.js";
import { ConflictError, UnauthorizedError } from "../utils/errorHandler.js";
import { signToken } from "../utils/helper.js";

export const registerUserService = async (name, email, password) => {
  const user = await findUserByEmail(email);
  if (user) throw new ConflictError("User already exists");

  const newUser = await createUser(name, email, password);
  const token = signToken({ id: newUser._id });
  return { user: newUser, token };
};

export const loginUserService = async (email, password) => {
  const user = await findUserByEmailByPassword(email);
  if (!user || !(await user.comparePassword(password))) {
    throw new UnauthorizedError("Invalid email or password");
  }
  const token = signToken({ id: user._id });
  return { user, token };
};
