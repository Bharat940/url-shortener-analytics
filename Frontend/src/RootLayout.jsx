import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/slices/authSlice.js";
import { getCurrentUser } from "./api/user.api";
import NavBar from "./components/NavBar";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const RootLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  const protectedRoutes = ["/dashboard", "/analytics"];

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const expiry = localStorage.getItem("token_expiry");

      if (!token || !expiry || Date.now() > parseInt(expiry, 10)) {
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");
        dispatch(logout());

        if (protectedRoutes.includes(location.pathname)) {
          navigate({ to: "/auth", search: { redirect: location.pathname } });
        }

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

        if (protectedRoutes.includes(location.pathname)) {
          navigate({ to: "/auth", search: { redirect: location.pathname } });
        }
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [dispatch, navigate, location.pathname]);

  if (!authChecked) {
    return (
      <div
        style={{
          backgroundColor: "#000",
          position: "fixed",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <Spin
          size="large"
          fullscreen
          tip="Loading…"
          indicator={
            <LoadingOutlined style={{ fontSize: 48, color: "#1890ff" }} spin />
          }
        />
      </div>
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
