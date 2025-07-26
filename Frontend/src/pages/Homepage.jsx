import React from "react";
import { useSelector } from "react-redux";
import { Link } from "@tanstack/react-router";
import { Button, Card, Divider, Typography } from "antd";
import UrlForm from "../components/UrlForm";

const { Title, Paragraph } = Typography;

const Homepage = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 flex flex-col items-center justify-start px-6 py-16">
      <div className="max-w-7xl text-center">
        {/* Hero Section */}
        <Title className="text-4xl md:text-6xl font-extrabold text-blue-700 dark:text-blue-400 mb-4 leading-tight">
          Shorten URLs & Generate QR Codes Instantly
        </Title>
        <Paragraph className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          Create secure, shareable links & beautiful QR codes with just one
          click.
          {!isAuthenticated && (
            <span className="block text-blue-600 dark:text-blue-400 font-medium mt-2">
              Try both URL shortening and QR code generation as a guest, or
              register for premium features!
            </span>
          )}
          {isAuthenticated && (
            <span className="block text-green-600 dark:text-green-400 font-medium mt-2">
              Welcome back! Enjoy all premium features including custom slugs
              and integrated QR generation.
            </span>
          )}
        </Paragraph>

        {/* Call-to-Actions */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
            <Button type="primary" size="large" className="shadow-md">
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
            </Button>
          </Link>
          {!isAuthenticated && (
            <Link to="/auth">
              <Button size="large" className="shadow-md">
                Login / Register
              </Button>
            </Link>
          )}
        </div>

        {/* URL Form Section */}
        <div className="mb-16">
          <Title level={3} className="text-gray-800 dark:text-gray-200 mb-6">
            Try It Now
          </Title>
          <UrlForm />
        </div>

        <Divider className="my-12 md:my-16" />

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
          {[
            {
              title: "Premium Features for Members",
              desc: "Registered users get custom slugs, integrated QR generation, and unlimited usage with analytics.",
            },
            {
              title: "Guest Access Available",
              desc: "Guests can create up to 10 short URLs and QR codes per hour using our separate tools.",
            },
            {
              title: "Simple & Secure",
              desc: "User authentication, fast processing, and privacy-focused design with dark/light theme support.",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              variant="outlined"
              hoverable
              className="rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
              style={{ minHeight: 180 }}
            >
              <Title
                level={4}
                className="text-blue-600 dark:text-blue-400 mb-2"
              >
                {feature.title}
              </Title>
              <Paragraph className="text-gray-600 dark:text-gray-400">
                {feature.desc}
              </Paragraph>
            </Card>
          ))}
        </div>

        <Divider className="my-12 md:my-16" />

        <div className="max-w-4xl mx-auto text-left space-y-6">
          <Title level={3} className="text-blue-600 dark:text-blue-300 mb-4">
            How It Works
          </Title>
          <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 text-lg">
            <li>
              Use the URL shortener to create compact links with optional custom
              slugs (logged in only).
            </li>
            <li>
              Generate QR codes for any URL using the dedicated QR code
              generator.
            </li>
            <li>
              Members can check "Generate QR Code with URL" to get both short
              URL and QR code in one step.
            </li>
            <li>
              Register to manage all your URLs and analytics securely in your
              dashboard.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
