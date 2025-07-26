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
      <div className="max-w-7xl w-full text-center">
        <Title className="text-4xl md:text-6xl font-extrabold text-blue-700 dark:text-blue-400 mb-6 leading-tight">
          Shorten URLs & Generate QR Codes Instantly
        </Title>

        <Paragraph className="text-lg md:text-xl mb-10 text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          Create secure, shareable links and beautiful QR codes quickly and
          easily.
        </Paragraph>

        <Card
          className="mb-12 max-w-3xl mx-auto text-left"
          variant="borderless"
          style={{ backgroundColor: "transparent" }}
        >
          <Title level={4} className="text-blue-600 dark:text-blue-400 mb-5">
            What You Can Do
          </Title>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-base space-y-3">
            <li>
              <strong>Guest Users:</strong> Create up to{" "}
              <strong>20 combined short URLs and QR codes per day</strong>{" "}
              without registration.
            </li>
            <li>
              <strong>Registered Users:</strong> Enjoy unlimited URL shortening,
              QR code generation,
              <u>custom slugs</u>, and detailed <strong>analytics</strong> on
              your URLs.
            </li>
            <li>
              Easily manage, track, and analyze all your URLs and get insights
              with our dashboard.
            </li>
            <li>
              Download QR codes easily and create shareable short links with a
              single click.
            </li>
          </ul>
        </Card>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
            <Button type="primary" size="large" className="shadow-md px-10">
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
            </Button>
          </Link>
          {!isAuthenticated && (
            <Link to="/auth">
              <Button size="large" className="shadow-md px-10">
                Login / Register
              </Button>
            </Link>
          )}
        </div>

        <Divider className="mb-16" />

        <div className="mb-20 max-w-3xl mx-auto">
          <Title level={3} className="text-gray-800 dark:text-gray-200 mb-6">
            Try It Now
          </Title>
          <UrlForm />
        </div>

        <Divider className="mb-16" />

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
          {[
            {
              title: "Premium Features for Members",
              desc: "Registered users get custom slugs, integrated QR generation, unlimited usage, detailed analytics, and complete URL management.",
            },
            {
              title: "Guest Access Available",
              desc: "Guests can create up to 20 combined short URLs and QR codes per day without registration.",
            },
            {
              title: "Simple & Secure",
              desc: "Fast URL shortening, secure user authentication, privacy-focused design, and built-in support for light/dark mode.",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              hoverable
              className="rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
              style={{ minHeight: 180 }}
              variant="borderless"
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

        <Divider className="mb-16" />

        <div className="max-w-4xl mx-auto text-left space-y-6">
          <Title level={3} className="text-blue-600 dark:text-blue-300 mb-4">
            How It Works
          </Title>
          <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 text-lg">
            <li>
              Use the URL shortener to create compact links with optional custom
              slugs (custom slugs require registration).
            </li>
            <li>
              Generate QR codes for any URL using the dedicated QR code
              generator.
            </li>
            <li>
              Registered users can check "Generate QR Code with URL" to get both
              the short URL and QR code together.
            </li>
            <li>
              Analyze your URL traffic and usage with integrated analytics
              available for registered members inside your dashboard.
            </li>
            <li>
              Register to securely manage all your URLs and enjoy unlimited
              usage.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
