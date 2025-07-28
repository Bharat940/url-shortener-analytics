import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "@tanstack/react-router";
import { Dropdown, Button, Switch, Tooltip } from "antd";
import {
  LogoutOutlined,
  MenuOutlined,
  BulbOutlined,
  BulbFilled,
  SettingOutlined,
} from "@ant-design/icons";
import { logout } from "../store/slices/authSlice.js";
import { toggleTheme } from "../store/slices/themeSlice.js";
import { logoutUser } from "../api/user.api.js";

const NavBar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const dropdownMenuItems = [
    {
      key: "profile",
      label: (
        <div className="px-2 py-1">
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {user?.name || "User"}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {user?.email}
          </div>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "dashboard",
      label: <Link to="/dashboard">Dashboard</Link>,
      icon: <SettingOutlined />,
    },
    { type: "divider" },
    {
      key: "logout",
      label: loggingOut ? "Logging out..." : "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      disabled: loggingOut,
    },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm fixed w-full z-50 top-0 left-0 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-blue-600 dark:text-blue-400 leading-none hover:underline"
            >
              URL Shortener
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/analytics"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Analytics
                </Link>
              </>
            )}

            <Tooltip title="Toggle Dark/Light Mode">
              <Switch
                checked={theme === "dark"}
                onChange={() => dispatch(toggleTheme())}
                checkedChildren={<BulbFilled />}
                unCheckedChildren={<BulbOutlined />}
                aria-label="Toggle Theme"
              />
            </Tooltip>

            {isAuthenticated ? (
              <Dropdown
                menu={{ items: dropdownMenuItems }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <div className="cursor-pointer flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {user?.name || "User"}
                  </span>
                </div>
              </Dropdown>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  className="ml-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-semibold"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center space-x-2">
            <Tooltip title="Toggle Dark/Light Mode">
              <Switch
                checked={theme === "dark"}
                onChange={() => dispatch(toggleTheme())}
                checkedChildren={<BulbFilled />}
                unCheckedChildren={<BulbOutlined />}
                aria-label="Toggle Theme"
                size="small"
              />
            </Tooltip>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMenuVisible(!menuVisible)}
              aria-label="Toggle mobile menu"
            />
          </div>
        </div>
      </div>

      {menuVisible && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => setMenuVisible(false)}
          >
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setMenuVisible(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/analytics"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setMenuVisible(false)}
              >
                Analytics
              </Link>
            </>
          )}
          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.name || "User"}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email}
                </div>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuVisible(false);
                }}
                disabled={loggingOut}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setMenuVisible(false)}
              >
                Login
              </Link>
              <Link
                to="/auth"
                className="block px-3 py-2 rounded-md text-base font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                onClick={() => setMenuVisible(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
