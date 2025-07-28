import React, { useState } from "react";
import { registerUser } from "../api/user.api";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice.js";
import { useNavigate } from "@tanstack/react-router";
import { Form, Input, Button, Alert, Typography } from "antd";

const { Title } = Typography;

const RegisterForm = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async ({ name, email, password }) => {
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const data = await registerUser(name, email, password);
      localStorage.setItem("token_expiry", Date.now() + 24 * 60 * 60 * 1000);

      dispatch(login({ token: data.token, user: data.user }));

      navigate({ to: "/dashboard" });
    } catch (err) {
      let errorMessage = "Registration failed. Please try again.";
      if (err?.response && err.response.data) {
        const responseData = err.response.data;
        if (typeof responseData === "string") {
          errorMessage = responseData;
        } else if (typeof responseData.message === "string") {
          errorMessage = responseData.message;
        } else if (
          responseData.success === false &&
          typeof responseData.message === "string"
        ) {
          errorMessage = responseData.message;
        } else {
          errorMessage = JSON.stringify(responseData);
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-xl shadow-md transition-colors duration-300">
      <Title level={2} className="text-center mb-6">
        Create an Account
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
        onSubmitCapture={(e) => e.preventDefault()}
        autoComplete="off"
        requiredMark={false}
        onFieldsChange={() => error && setError(null)}
      >
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: "Please input your full name!" }]}
        >
          <Input size="large" placeholder="Full Name" />
        </Form.Item>

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
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
          hasFeedback
        >
          <Input.Password size="large" placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Create Account
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterForm;
