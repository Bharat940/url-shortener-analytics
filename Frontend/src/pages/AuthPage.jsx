import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearch, Link } from "@tanstack/react-router";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { Tabs } from "antd";
import { LinkOutlined } from "@ant-design/icons";

const AuthPage = () => {
  const [activeKey, setActiveKey] = useState("login");
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = search?.redirect || "/dashboard";
      navigate({ to: redirectTo });
    }
  }, [isAuthenticated, navigate, search]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-12 transition-colors duration-300">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              <LinkOutlined className="text-xl rotate-45" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-foreground">
              SnipLink
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Access custom slugs, unlimited link shortening, and real-time analytics.
          </p>
        </div>

        {/* Auth Card */}
        <div className="ui-card p-6 sm:p-8 shadow-sm">
          <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            centered
            size="large"
            destroyOnHidden
            items={[
              { key: "login", label: <span className="font-semibold px-4">Sign In</span>, children: <LoginForm /> },
              { key: "register", label: <span className="font-semibold px-4">Create Account</span>, children: <RegisterForm /> },
            ]}
          />
        </div>

        <div className="text-center text-xs text-muted-foreground">
          By signing in, you agree to our Terms of Service & Privacy Policy.
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
