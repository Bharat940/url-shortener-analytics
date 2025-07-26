import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearch } from "@tanstack/react-router";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { Tabs, Card, Typography } from "antd";

const { Title } = Typography;

const AuthPage = () => {
  const [activeKey, setActiveKey] = useState("login");
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });

  React.useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = search?.redirect || "/dashboard";
      navigate({ to: redirectTo });
    }
  }, [isAuthenticated, navigate, search]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4 transition-colors duration-500">
      <Card
        variant="outlined"
        className="w-full max-w-md shadow-lg dark:bg-gray-800"
        styles={{
          body: { padding: 40, borderRadius: 16 },
        }}
      >
        <Title
          level={3}
          className="text-center mb-6 text-gray-800 dark:text-white"
        >
          Welcome! Please Sign In or Register
        </Title>

        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          centered
          size="large"
          destroyOnHidden
          items={[
            { key: "login", label: "Login", children: <LoginForm /> },
            { key: "register", label: "Register", children: <RegisterForm /> },
          ]}
        />
      </Card>
    </div>
  );
};

export default AuthPage;
