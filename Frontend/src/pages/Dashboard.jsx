import React from "react";
import UrlForm from "../components/UrlForm.jsx";
import UserUrl from "../components/UserUrl.jsx";
import { Layout, Typography } from "antd";

const { Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  return (
    <Layout className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Content className="flex flex-col items-center px-4 py-12 w-full">
        <div className="w-full max-w-7xl bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg space-y-8 transition-colors duration-300">
          <Title
            level={2}
            className="text-center font-semibold text-gray-900 dark:text-white"
          >
            URL Shortener Dashboard
          </Title>
          <UrlForm />
          <UserUrl />
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;
