import axiosInstance from "../utils/axiosInstance.js";

export const loginUser = async (email, password) => {
  try {
    const { data } = await axiosInstance.post("/api/auth/login", {
      email,
      password,
    });
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw error;
    }
  }
};

export const registerUser = async (name, email, password) => {
  try {
    const { data } = await axiosInstance.post("/api/auth/register", {
      name,
      email,
      password,
    });
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw error;
    }
  }
};

export const logoutUser = async () => {
  try {
    const { data } = await axiosInstance.get("/api/auth/logout");
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw error;
    }
  }
};

export const getCurrentUser = async () => {
  try {
    const { data } = await axiosInstance.get("/api/auth/me");
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw error;
    }
  }
};

export const getAllUserUrls = async () => {
  const { data } = await axiosInstance.post("/api/user/urls");
  return data;
};
