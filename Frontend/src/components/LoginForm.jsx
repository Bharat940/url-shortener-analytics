import React, { useState } from "react";
import { loginUser } from "../api/user.api";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice.js";
import { useNavigate } from "@tanstack/react-router";
import { Form, Input, Button, Alert, Typography } from "antd";

const { Title } = Typography;

const LoginForm = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(email, password);
      dispatch(login(data.user));
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-xl shadow-md transition-all duration-300">
      <Title
        level={2}
        className="text-center mb-6 text-gray-900 dark:text-gray-100"
      >
        Login
      </Title>

      {error && (
        <Alert
          type="error"
          message={error}
          className="mb-4"
          closable
          onClose={() => setError(null)}
          showIcon
        />
      )}

      <Form
        name="login_form"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        requiredMark={false}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input size="large" placeholder="email@example.com" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password size="large" placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
