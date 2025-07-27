import { redirect } from "@tanstack/react-router";
import { getCurrentUser } from "../api/user.api.js";
import { login } from "../store/slices/authSlice.js";

export const checkAuth = async ({ context }) => {
  try {
    const { store, queryClient } = context;
    const data = await queryClient.ensureQueryData({
      queryKey: ["currentUser"],
      queryFn: getCurrentUser,
    });

    const user = data?.user;

    if (!user) {
      throw redirect({
        to: "/auth",
        search: {
          redirect: window.location.pathname,
        },
      });
    }

    store.dispatch(login(user));
    const { isAuthenticated } = store.getState().auth;
    if (!isAuthenticated) {
      throw redirect({
        to: "/auth",
        search: {
          redirect: window.location.pathname,
        },
      });
    }
    return true;
  } catch (error) {
    throw redirect({
      to: "/auth",
      search: {
        redirect: window.location.pathname,
      },
    });
  }
};
