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
      localStorage.setItem("token_expiry", Date.now() + 24 * 60 * 60 * 1000);

      dispatch(login({ token: data.token, user: data.user }));

      navigate({ to: "/dashboard" });
    } catch (err) {
      let errorMessage = "Unable to sign in. Please check your credentials.";
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
    <div className="w-full text-foreground p-2">
      <Title
        level={3}
        className="text-center mb-6 text-foreground font-bold"
      >
        Welcome Back
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
          label="Email Address"
          name="email"
          rules={[
            { required: true, message: "Please enter your email address" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input size="large" placeholder="name@example.com" className="rounded-md" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password size="large" placeholder="Enter your password" className="rounded-md" />
        </Form.Item>

        <Form.Item className="mt-6 mb-0">
          <Button type="primary" htmlType="submit" loading={loading} block className="btn-primary h-11 text-base font-semibold">
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
