import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/slices/authSlice.js";
import { getCurrentUser } from "./api/user.api";
import NavBar from "./components/NavBar";
import { Outlet } from "@tanstack/react-router";
import { Spin } from "antd";

const RootLayout = () => {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        if (data?.user) dispatch(login(data.user));
        else dispatch(logout());
      } catch {
        dispatch(logout());
      } finally {
        setAuthChecked(true);
      }
    };
    fetchUser();
  }, [dispatch]);

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
