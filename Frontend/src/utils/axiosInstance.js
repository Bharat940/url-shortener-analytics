import axios from "axios";
import store from "../store/store";
import { logout } from "../store/slices/authSlice";

const baseURL = import.meta.env.VITE_APP_URL || "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL,
  timeout: 60000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("token_expiry");
      store.dispatch(logout());
    }
    return Promise.reject({
      message:
        error.response?.data?.message || error.message || "Unknown error",
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default axiosInstance;
