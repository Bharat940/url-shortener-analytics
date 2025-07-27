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
  Tooltip,
  Typography,
  Space,
} from "antd";
import {
  BarChartOutlined,
  EyeOutlined,
  LinkOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
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

const BASE_URL = import.meta.env.VITE_APP_URL || "http://localhost:3000";

const Analytics = () => {
  const isMobile = useIsMobile();

  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);
  const [selectedUrl, setSelectedUrl] = useState("all");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["analytics", dateRange, selectedUrl],
    queryFn: () =>
      getAnalytics({
        startDate: dateRange[0].format("YYYY-MM-DD"),
        endDate: dateRange[1].format("YYYY-MM-DD"),
        urlId: selectedUrl === "all" ? null : selectedUrl,
      }),
    refetchInterval: 60000,
  });

  if (isLoading)
    return (
      <div className="flex justify-center my-8">
        <Spin size="large" />
      </div>
    );

  if (isError)
    return (
      <Alert
        message="Error"
        description={`Error loading analytics: ${error?.message || error}`}
        type="error"
        showIcon
        className="my-4"
      />
    );

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

  if (noData)
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <Title level={2} className="text-gray-900 dark:text-white mb-6">
          Analytics Dashboard
        </Title>
        <Card>
          <Text type="secondary" className="text-lg">
            No analytics data available.
          </Text>
        </Card>
      </div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <Title level={2} className="text-gray-900 dark:text-white mb-6">
        Analytics Dashboard
      </Title>

      <Card className="mb-6">
        <div style={{ padding: 12 }}>
          <Space
            direction={isMobile ? "vertical" : "horizontal"}
            size="middle"
            align="center"
            style={{ width: "100%", flexWrap: "wrap" }}
          >
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
              allowEmpty={[false, false]}
              style={{ width: isMobile ? "100%" : "auto", minWidth: 280 }}
              size={isMobile ? "middle" : "large"}
            />
            <Select
              value={selectedUrl}
              onChange={setSelectedUrl}
              placeholder="Select URL"
              showSearch
              options={[
                { label: "All URLs", value: "all" },
                ...(analytics.urls || []).map(({ _id, short_url, clicks }) => ({
                  label: `${short_url} (${clicks} clicks)`,
                  value: _id,
                })),
              ]}
              optionFilterProp="label"
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              style={{ width: isMobile ? "100%" : 250 }}
              size={isMobile ? "middle" : "large"}
              popupMatchSelectWidth={false}
            />
          </Space>
        </div>
      </Card>

      <Row
        gutter={[16, 16]}
        justify={isMobile ? "center" : "start"}
        className="mb-6"
      >
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
              style={{ whiteSpace: "nowrap" }}
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
              style={{ whiteSpace: "nowrap" }}
              valueStyle={{ color: "#eb2f96" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} wrap={true} className="mb-8">
        <Col xs={24} md={12}>
          <Card title="Click Trends (Last 30 Days)" style={{ minHeight: 300 }}>
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
                  labelFormatter={(value) =>
                    dayjs(value).format("MMM DD, YYYY")
                  }
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
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Geographic Distribution" style={{ minHeight: 300 }}>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <BarChart data={geoData.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="country"
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="clicks" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} wrap={true} className="mb-8">
        <Col xs={24} md={8}>
          <Card title="Device Distribution" style={{ minHeight: 300 }}>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={isMobile ? 70 : 80}
                  fill="#8884d8"
                  dataKey="clicks"
                  nameKey="device"
                  label={({ percent, device }) =>
                    `${device} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
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
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Browser Distribution" style={{ minHeight: 300 }}>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <PieChart>
                <Pie
                  data={browserData.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  outerRadius={isMobile ? 70 : 80}
                  fill="#8884d8"
                  dataKey="clicks"
                  nameKey="browser"
                  label={({ percent, browser }) =>
                    `${browser} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {browserData.slice(0, 6).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card title="Top Performing URLs">
        <Table
          columns={[
            {
              title: "Short URL",
              dataIndex: "short_url",
              key: "short_url",
              render: (text) => (
                <a
                  href={`${BASE_URL}/${text}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400"
                  style={{ wordBreak: "break-word" }}
                  aria-label={`Shortened URL: ${BASE_URL}/${text}`}
                >
                  {`${BASE_URL}/${text}`}
                </a>
              ),
            },
            {
              title: "Original URL",
              dataIndex: "full_url",
              key: "full_url",
              ellipsis: true,
              render: (text) => (
                <Text ellipsis style={{ maxWidth: 350 }}>
                  {text}
                </Text>
              ),
            },
            {
              title: "Clicks",
              dataIndex: "clicks",
              key: "clicks",
              sorter: (a, b) => a.clicks - b.clicks,
              defaultSortOrder: "descend",
              width: 100,
              render: (clicks) => <Tag>{clicks}</Tag>,
            },
            {
              title: "Created",
              dataIndex: "createdAt",
              key: "createdAt",
              width: 140,
              render: (date) => dayjs(date).format("MMM DD, YYYY"),
            },
          ]}
          dataSource={topUrls}
          pagination={{ pageSize: 10 }}
          rowKey={(record) => record._id}
          size={isMobile ? "small" : "middle"}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
};

export default Analytics;
