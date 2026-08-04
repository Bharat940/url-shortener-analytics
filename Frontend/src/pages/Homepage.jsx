import React from "react";
import { useSelector } from "react-redux";
import { Link } from "@tanstack/react-router";
import { Button, Card, Tabs } from "antd";
import {
  ThunderboltOutlined,
  QrcodeOutlined,
  BarChartOutlined,
  LockOutlined,
  CheckCircleFilled,
  ArrowRightOutlined,
  GlobalOutlined,
  StarFilled,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import ShortenUrlForm from "../components/ShortenUrlForm";
import QrCodeForm from "../components/QrCodeForm";

const Homepage = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const tabItems = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-2 font-semibold text-sm sm:text-base px-2">
          <ThunderboltOutlined className="text-primary" /> Shorten URL
        </span>
      ),
      children: <ShortenUrlForm />,
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-2 font-semibold text-sm sm:text-base px-2">
          <QrcodeOutlined className="text-primary" /> Generate QR Code
        </span>
      ),
      children: <QrCodeForm />,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col items-center justify-start px-4 sm:px-6 py-12">
      <div className="max-w-6xl w-full text-center relative z-10 space-y-12">
        {/* Hero Section Header */}
        <div className="space-y-6 max-w-4xl mx-auto pt-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted border border-border text-foreground text-xs sm:text-sm font-semibold shadow-xs">
            <StarFilled className="text-amber-500" />
            <span>Built with React, Node.js & Redis Rate Limiting</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Shorten Links. <br className="hidden sm:inline" />
            Generate QRs. <span className="text-primary">Track Real-time Analytics.</span>
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create high-speed short URLs, instant high-res QR codes, and gain deep geographical and device insights across all your active links.
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
              <Button
                type="primary"
                size="large"
                className="btn-primary font-semibold px-8 h-12 rounded-lg text-base shadow-sm flex items-center gap-2"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                <ArrowRightOutlined />
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link to="/auth">
                <Button
                  size="large"
                  className="font-semibold px-8 h-12 rounded-lg text-base border-border text-foreground hover:bg-secondary"
                >
                  Sign In / Register
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Core Generator Card (Tabbed) */}
        <div className="max-w-2xl mx-auto w-full">
          <div className="ui-card p-4 sm:p-8 shadow-md relative">
            {!isAuthenticated && (
              <div className="mb-6 px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-xs sm:text-sm font-medium flex items-center justify-between gap-2 text-left">
                <span className="flex items-center gap-2">
                  <SafetyCertificateOutlined className="text-base text-primary shrink-0" />
                  <strong>Guest Mode:</strong> Up to 20 URLs/QRs per day.
                </span>
                <Link to="/auth" className="underline font-bold text-primary shrink-0">
                  Register for Unlimited
                </Link>
              </div>
            )}

            <Tabs
              defaultActiveKey="1"
              items={tabItems}
              centered
              className="custom-tabs"
            />
          </div>
        </div>

        {/* Feature Grid */}
        <div className="pt-12 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Everything You Need in One Platform
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Designed for developers, creators, and businesses needing fast link management.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            {[
              {
                icon: <ThunderboltOutlined className="text-xl text-primary" />,
                title: "Ultra-Fast Redirects",
                desc: "High-throughput request processing ensures your links resolve in sub-50ms with sub-second QR code generation.",
              },
              {
                icon: <QrcodeOutlined className="text-xl text-primary" />,
                title: "Dynamic QR Codes",
                desc: "Generate high-resolution PNG QR codes instantly for any URL with 1-click download functionality.",
              },
              {
                icon: <BarChartOutlined className="text-xl text-primary" />,
                title: "Real-time Analytics",
                desc: "Track total clicks, geographic location, device type, browser stats, and engagement trends over time.",
              },
              {
                icon: <LockOutlined className="text-xl text-primary" />,
                title: "Rate Limited & Secure",
                desc: "Redis-backed rate limiting protects endpoints against spam, automated bots, and burst traffic.",
              },
              {
                icon: <GlobalOutlined className="text-xl text-primary" />,
                title: "Custom Link Slugs",
                desc: "Registered users can brand their links with personalized custom slugs for maximum trust and engagement.",
              },
              {
                icon: <CheckCircleFilled className="text-xl text-primary" />,
                title: "Guest & Pro Tiers",
                desc: "Guests get 20 creations per day without signing up, while registered members unlock unlimited link control.",
              },
            ].map((item, idx) => (
              <Card
                key={idx}
                className="ui-card shadow-sm hover:shadow-md transition-shadow duration-200"
                variant="borderless"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-12 border-t border-border text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} SnipLink • Full-Stack URL Shortener & Analytics
          </div>
          <div className="flex gap-4">
            <a href="https://github.com/Bharat940/url-shortener-analytics" target="_blank" rel="noreferrer" className="hover:text-foreground">
              GitHub Repository
            </a>
            <a href="https://bharat-url-shortener.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-foreground">
              Live Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
