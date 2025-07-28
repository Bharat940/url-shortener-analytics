import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/slices/authSlice.js";
import { getCurrentUser } from "./api/user.api";
import NavBar from "./components/NavBar";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { Spin } from "antd";

const RootLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const expiry = localStorage.getItem("token_expiry");

      if (!token || !expiry || Date.now() > parseInt(expiry, 10)) {
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");
        dispatch(logout());
        navigate({ to: "/auth" });
        setAuthChecked(true);
        return;
      }

      try {
        const data = await getCurrentUser();
        if (data?.user) {
          const existingToken = localStorage.getItem("token");
          dispatch(login({ token: existingToken, user: data.user }));
        } else {
          throw new Error("Invalid token");
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");
        dispatch(logout());
        navigate({ to: "/auth" });
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [dispatch, navigate]);

  if (!authChecked) {
    return (
      <Spin
        size="large"
        tip="Loading…"
        spinning={true}
        className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
        style={{ color: "#1890ff" }}
        aria-label="Loading"
      >
        <div />
      </Spin>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-all duration-300">
      <NavBar />
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
