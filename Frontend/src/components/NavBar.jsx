import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { Dropdown, Button, Switch, Tooltip, Avatar } from "antd";
import {
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
  SunOutlined,
  MoonOutlined,
  DashboardOutlined,
  BarChartOutlined,
  LinkOutlined,
  UserOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { logout } from "../store/slices/authSlice.js";
import { toggleTheme } from "../store/slices/themeSlice.js";
import { logoutUser } from "../api/user.api.js";

const NavBar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(logout());
      navigate({ to: "/" });
      setLoggingOut(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  const dropdownMenuItems = [
    {
      key: "profile",
      label: (
        <div className="px-3 py-2">
          <div className="font-semibold text-foreground">
            {user?.name || "Member Account"}
          </div>
          <div className="text-xs text-muted-foreground">
            {user?.email}
          </div>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "dashboard",
      label: <Link to="/dashboard" className="font-medium">My Links Dashboard</Link>,
      icon: <DashboardOutlined className="text-primary" />,
    },
    {
      key: "analytics",
      label: <Link to="/analytics" className="font-medium">Analytics Overview</Link>,
      icon: <BarChartOutlined className="text-primary" />,
    },
    { type: "divider" },
    {
      key: "logout",
      label: loggingOut ? "Signing out..." : "Sign Out",
      icon: <LogoutOutlined className="text-destructive" />,
      onClick: handleLogout,
      disabled: loggingOut,
    },
  ];

  return (
    <nav className="ui-nav fixed w-full z-50 top-0 left-0 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 group transition-transform duration-200 hover:scale-105"
            >
              <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                <LinkOutlined className="text-lg rotate-45" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-foreground leading-none">
                  SnipLink
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">
                  URL & QR Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-150 ${
                isActive("/")
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              Home
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-150 flex items-center gap-1.5 ${
                    isActive("/dashboard")
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <DashboardOutlined /> Dashboard
                </Link>
                <Link
                  to="/analytics"
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-150 flex items-center gap-1.5 ${
                    isActive("/analytics")
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <BarChartOutlined /> Analytics
                </Link>
              </>
            )}

            <div className="h-5 w-[1px] bg-border mx-2" />

            {/* Theme Switcher */}
            <Tooltip title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              <button
                onClick={() => dispatch(toggleTheme())}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? (
                  <SunOutlined className="text-amber-400 text-lg" />
                ) : (
                  <MoonOutlined className="text-primary text-lg" />
                )}
              </button>
            </Tooltip>

            {/* Auth Button or User Menu */}
            {isAuthenticated ? (
              <Dropdown
                menu={{ items: dropdownMenuItems }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border hover:bg-secondary transition-colors duration-150">
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    className="bg-primary text-primary-foreground"
                  />
                  <span className="text-sm font-semibold text-foreground max-w-[120px] truncate">
                    {user?.name || "Account"}
                  </span>
                </button>
              </Dropdown>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to="/auth"
                  className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="btn-primary text-sm font-semibold px-4 py-2 flex items-center gap-1.5"
                >
                  Get Started <ArrowRightOutlined className="text-xs" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-md text-muted-foreground"
            >
              {theme === "dark" ? (
                <SunOutlined className="text-amber-400 text-lg" />
              ) : (
                <MoonOutlined className="text-primary text-lg" />
              )}
            </button>
            <Button
              type="text"
              icon={menuVisible ? <CloseOutlined /> : <MenuOutlined />}
              onClick={() => setMenuVisible(!menuVisible)}
              className="text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {menuVisible && (
        <div className="md:hidden px-4 pt-3 pb-6 space-y-2 bg-background border-b border-border animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            to="/"
            className={`block px-4 py-2.5 rounded-md text-base font-semibold ${
              isActive("/") ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
            }`}
            onClick={() => setMenuVisible(false)}
          >
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className={`block px-4 py-2.5 rounded-md text-base font-semibold ${
                  isActive("/dashboard") ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
                }`}
                onClick={() => setMenuVisible(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/analytics"
                className={`block px-4 py-2.5 rounded-lg text-base font-semibold ${
                  isActive("/analytics") ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
                }`}
                onClick={() => setMenuVisible(false)}
              >
                Analytics
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <div className="pt-3 border-t border-border space-y-2">
              <div className="px-4 py-2 bg-secondary rounded-md">
                <div className="text-sm font-semibold text-foreground">
                  {user?.name || "Member"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {user?.email}
                </div>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuVisible(false);
                }}
                disabled={loggingOut}
                className="w-full text-left px-4 py-2.5 rounded-md text-base font-semibold text-destructive hover:bg-destructive/10 transition-colors"
              >
                {loggingOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Link
                to="/auth"
                className="w-full text-center py-2.5 rounded-md font-semibold text-foreground border border-border"
                onClick={() => setMenuVisible(false)}
              >
                Sign In
              </Link>
              <Link
                to="/auth"
                className="w-full text-center py-2.5 rounded-md font-semibold btn-primary"
                onClick={() => setMenuVisible(false)}
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
