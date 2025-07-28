import { redirect } from "@tanstack/react-router";
import store from "../store/store.js";

export const checkAuth = () => {
  const token = localStorage.getItem("token");
  const { isAuthenticated } = store.getState().auth;
  if (!isAuthenticated || !token) {
    throw redirect({
      to: "/auth",
      search: { redirect: window.location.pathname },
    });
  }
};

export const checkGuest = () => {
  const { isAuthenticated } = store.getState().auth;
  if (isAuthenticated) {
    throw redirect({
      to: "/dashboard",
    });
  }
};
