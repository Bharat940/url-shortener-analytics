import { redirect } from "@tanstack/react-router";
import { getCurrentUser } from "../api/user.api.js";
import { login, logout } from "../store/slices/authSlice.js";

export const checkAuth = async ({ context }) => {
  const { store } = context;
  try {
    const data = await getCurrentUser();
    if (data?.user) {
      const token =
        store.getState().auth.token || localStorage.getItem("token");
      store.dispatch(login({ token, user: data.user }));
      return true;
    } else {
      store.dispatch(logout());
      throw redirect({
        to: "/auth",
        search: { redirect: window.location.pathname },
      });
    }
  } catch {
    store.dispatch(logout());
    throw redirect({
      to: "/auth",
      search: { redirect: window.location.pathname },
    });
  }
};

export const checkGuest = async ({ context }) => {
  const { store } = context;
  try {
    const data = await getCurrentUser();
    if (data?.user) {
      store.dispatch(login(data.user));
      throw redirect({ to: "/dashboard" });
    } else {
      store.dispatch(logout());
      return true;
    }
  } catch {
    store.dispatch(logout());
    return true;
  }
};
