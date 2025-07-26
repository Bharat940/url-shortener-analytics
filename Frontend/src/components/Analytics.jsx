import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "../api/analytics.api.js";
import { useIsMobile } from "../hooks/useIsMobile.js";
import {
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Select,
  Spin,
  Alert,
  Tag,
  Table,
  Space,
  Typography,
} from "antd";
import {
  BarChartOutlined,
  EyeOutlined,
  LinkOutlined,
  CalendarOutlined,
  GlobalOutlined,
  MobileOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import dayjs from "dayjs";
import { useState } from "react";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const Analytics = () => {
  const isMobile = useIsMobile();
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, "days"),
    dayjs(),
  ]);

  const [selectedUrl, setSelectedUrl] = useState("all");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["analytics", dateRange, selectedUrl],
    queryFn: () =>
      getAnalytics({
        startDate: dateRange[0]?.format("YYYY-MM-DD"),
        endDate: dateRange[1]?.format("YYYY-MM-DD"),
        urlId: selectedUrl === "all" ? null : selectedUrl,
      }),
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Error"
        description={`Error loading analytics: ${error.message}`}
        type="error"
        showIcon
        className="my-4"
      />
    );
  }

  const analytics = data || {};
  const {
    summary = {},
    clickTrends = [],
    geoData = [],
    deviceData = [],
    browserData = [],
    topUrls = [],
  } = analytics;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-4">
      <Title level={2} className="text-gray-900 dark:text-gray-100">
        Analytics Dashboard
      </Title>

      {/* Controls */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Space
            direction={isMobile ? "vertical" : "horizontal"}
            className="w-full"
          >
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              className="w-full md:w-auto"
            />
            <Select
              value={selectedUrl}
              onChange={setSelectedUrl}
              placeholder="Select URL"
              className="w-full md:w-64"
              options={[
                { label: "All URLs", value: "all" },
                ...(analytics.urls || []).map((url) => ({
                  label: `${url.short_url} (${url.clicks} clicks)`,
                  value: url._id,
                })),
              ]}
            />
          </Space>
        </div>
      </Card>

      {/* Summary Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Clicks"
              value={summary.totalClicks || 0}
              prefix={<EyeOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total URLs"
              value={summary.totalUrls || 0}
              prefix={<LinkOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg Clicks/URL"
              value={summary.avgClicksPerUrl || 0}
              precision={1}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active URLs"
              value={summary.activeUrls || 0}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#eb2f96" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        {/* Click Trends */}
        <Col xs={24} lg={12}>
          <Card title="Click Trends (Last 30 Days)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={clickTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => dayjs(value).format("MM/DD")}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) =>
                    dayjs(value).format("MMM DD, YYYY")
                  }
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Geographic Distribution */}
        <Col xs={24} lg={12}>
          <Card title="Geographic Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={geoData.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clicks" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Device Distribution */}
        <Col xs={24} lg={12}>
          <Card title="Device Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ device, percent }) =>
                    `${device} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="clicks"
                  nameKey="device"
                >
                  {deviceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Browser Distribution */}
        <Col xs={24} lg={12}>
          <Card title="Browser Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={browserData.slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="browser" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clicks" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Top Performing URLs */}
      <Card title="Top Performing URLs">
        <Table
          columns={[
            {
              title: "Short URL",
              dataIndex: "short_url",
              key: "short_url",
              render: (text) => (
                <a
                  href={`http://localhost:3000/${text}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400"
                >
                  {text}
                </a>
              ),
            },
            {
              title: "Original URL",
              dataIndex: "full_url",
              key: "full_url",
              render: (text) => (
                <span className="truncate max-w-xs" title={text}>
                  {text.length > 50 ? `${text.substring(0, 50)}...` : text}
                </span>
              ),
              ellipsis: true,
            },
            {
              title: "Clicks",
              dataIndex: "clicks",
              key: "clicks",
              render: (clicks) => <Tag color="blue">{clicks}</Tag>,
              sorter: (a, b) => a.clicks - b.clicks,
              defaultSortOrder: "descend",
            },
            {
              title: "Created",
              dataIndex: "createdAt",
              key: "createdAt",
              render: (date) => dayjs(date).format("MMM DD, YYYY"),
            },
          ]}
          dataSource={topUrls}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          size={isMobile ? "small" : "default"}
          scroll={{ x: isMobile ? 800 : undefined }}
        />
      </Card>
    </div>
  );
};

export default Analytics;
