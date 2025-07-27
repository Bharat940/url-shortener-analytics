import React from "react";
import { Outlet } from "@tanstack/react-router";
import NavBar from "./components/NavBar";

const RootLayout = () => {

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
