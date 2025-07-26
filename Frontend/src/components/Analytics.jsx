import React, { useState } from "react";
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
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const BASE_SHORT_URL = import.meta.env.VITE_APP_URL || "http://localhost:3000";

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
        description={`Error loading analytics: ${error.message || error}`}
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

  const noData =
    !summary.totalUrls ||
    summary.totalUrls === 0 ||
    topUrls.length === 0 ||
    (clickTrends.length === 0 && geoData.length === 0);

  if (noData) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <Title level={2} className="text-gray-900 dark:text-gray-100 mb-6">
          Analytics Dashboard
        </Title>
        <Card>
          <Text type="secondary" className="text-lg">
            No analytics data available. Create some URLs to see analytics here.
          </Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <Title level={2} className="text-gray-900 dark:text-gray-100">
        Analytics Dashboard
      </Title>

      <Card className="mb-6" style={{ padding: 0 }}>
        <div style={{ padding: 12 }}>
          <Space
            direction={isMobile ? "vertical" : "horizontal"}
            className="w-full"
            size="middle"
          >
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              className="w-full md:w-auto"
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
              allowEmpty={[false, false]}
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
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Space>
        </div>
      </Card>

      <Row gutter={[16, 16]} justify={isMobile ? "center" : "start"} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Clicks"
              value={summary.totalClicks || 0}
              prefix={<EyeOutlined />}
              valueStyle={{ color: "#3f8600" }}
              style={{ whiteSpace: "nowrap" }}
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
              style={{ whiteSpace: "nowrap" }}
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
              style={{ whiteSpace: "nowrap" }}
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
              style={{ whiteSpace: "nowrap" }}
            />
          </Card>
        </Col>
      </Row>

      <div className={`flex flex-wrap gap-6 ${isMobile ? "justify-center" : ""}`}>
        <Card
          title="Click Trends (Last 30 Days)"
          className={isMobile ? "w-full" : "w-[48%]"}
          style={{ minWidth: 300, padding: 0 }}
        >
          <div style={{ padding: 12 }}>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <LineChart data={clickTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  tickFormatter={(value) => dayjs(value).format("MM/DD")}
                />
                <YAxis />
                <RechartsTooltip
                  labelFormatter={(value) => dayjs(value).format("MMM DD, YYYY")}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          title="Geographic Distribution"
          className={isMobile ? "w-full" : "w-[48%]"}
          style={{ minWidth: 300, padding: 0 }}
        >
          <div style={{ padding: 12 }}>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <BarChart data={geoData.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" tick={{ fontSize: isMobile ? 10 : 12 }} />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="clicks" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          title="Device Distribution"
          className={isMobile ? "w-full" : "w-[48%]"}
          style={{ minWidth: 300, padding: 0 }}
        >
          <div style={{ padding: 12 }}>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ device, percent }) =>
                    `${device} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={isMobile ? 70 : 80}
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
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          title="Browser Distribution"
          className={isMobile ? "w-full" : "w-[48%]"}
          style={{ minWidth: 300, padding: 0 }}
        >
          <div style={{ padding: 12 }}>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <BarChart data={browserData.slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="browser" tick={{ fontSize: isMobile ? 10 : 12 }} />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="clicks" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Top Performing URLs">
        <Table
          columns={[
            {
              title: "Short URL",
              dataIndex: "short_url",
              key: "short_url",
              render: (text) => {
                const fullShortUrl = `${BASE_SHORT_URL}/${text}`;
                return (
                  <a
                    href={fullShortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400"
                    style={{ wordBreak: "break-all" }}
                    aria-label={`Shortened URL: ${fullShortUrl}`}
                  >
                    {fullShortUrl}
                  </a>
                );
              },
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
              width: 100,
            },
            {
              title: "Created",
              dataIndex: "createdAt",
              key: "createdAt",
              render: (date) => dayjs(date).format("MMM DD, YYYY"),
              width: 140,
            },
          ]}
          dataSource={topUrls}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          size={isMobile ? "small" : "default"}
          scroll={{ x: isMobile ? 800 : undefined }}
          className={isMobile ? "mobile-analytics-table" : ""}
        />
      </Card>
    </div>
  );
};

export default Analytics;
