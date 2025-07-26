import React from "react";
import { Outlet } from "@tanstack/react-router";
import NavBar from "./components/NavBar";
import useRestoreAuth from "./hooks/useRestoreAuth.js";

const RootLayout = () => {
  useRestoreAuth();

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
