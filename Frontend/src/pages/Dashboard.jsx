import UrlForm from "../components/UrlForm.jsx";
import UserUrl from "../components/UserUrl.jsx";
import { useSelector } from "react-redux";
import { Link } from "@tanstack/react-router";
import { Button } from "antd";
import {
  LinkOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Banner */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, <span className="gradient-text">{user?.name || "Creator"}</span>! 👋
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your shortened URLs, generate QR codes, and view real-time click analytics.
            </p>
          </div>

          <Link to="/analytics">
            <Button
              type="primary"
              size="large"
              icon={<BarChartOutlined />}
              className="gradient-bg border-0 font-semibold rounded-xl h-11 px-6 shadow-md hover:shadow-lg flex items-center gap-2 shrink-0"
            >
              View Analytics
            </Button>
          </Link>
        </div>

        {/* Quick Shorten Section */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-border space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white shadow-md">
              <ThunderboltOutlined className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Quick Link & QR Generator</h2>
              <p className="text-xs text-muted-foreground">
                Shorten long URLs with optional custom slugs and instant QR codes.
              </p>
            </div>
          </div>

          <UrlForm />
        </div>

        {/* User URL Table */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-border space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <LinkOutlined className="text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Your Shortened Links</h2>
                <p className="text-xs text-muted-foreground">
                  Search, copy, download QR codes, and trace individual link analytics.
                </p>
              </div>
            </div>
          </div>

          <UserUrl />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
