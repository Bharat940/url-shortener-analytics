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
  Typography,
  Table,
  Tag,
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
const COLORS = ["#1890ff", "#13c2c2", "#ffc53d", "#eb2f96", "#722ed1"];
const BASE_URL = import.meta.env.VITE_APP_URL || "http://localhost";

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
    !summary.totalUrls || summary.totalUrls === 0 || topUrls.length === 0;

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

      <Card className="mb-6 shadow-md rounded-xl">
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            disabledDate={(current) =>
              current && current > dayjs().endOf("day")
            }
            allowEmpty={[false, false]}
            style={{
              flex: 1,
              minWidth: isMobile ? "100%" : 280,
              maxWidth: 400,
            }}
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
            style={{
              flex: 1,
              minWidth: isMobile ? "100%" : 280,
              maxWidth: 400,
            }}
            size={isMobile ? "middle" : "large"}
            popupMatchSelectWidth={false}
          />
        </div>
      </Card>

      <Row gutter={[16, 16]} className="mb-6">
        {[
          {
            title: "Total Clicks",
            value: summary.totalClicks,
            icon: <EyeOutlined />,
            color: "#3f8600",
          },
          {
            title: "Total URLs",
            value: summary.totalUrls,
            icon: <LinkOutlined />,
            color: "#1890ff",
          },
          {
            title: "Avg Clicks/URL",
            value: summary.avgClickPerUrl ?? summary.avgClicksPerUrl,
            icon: <BarChartOutlined />,
            color: "#722ed1",
          },
          {
            title: "Active URLs",
            value: summary.activeUrls,
            icon: <CalendarOutlined />,
            color: "#eb2f96",
          },
        ].map((stat, idx) => (
          <Col xs={12} md={6} key={idx}>
            <Card className="rounded-md shadow-sm">
              <Statistic
                title={stat.title}
                value={stat.value ?? 0}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} md={12}>
          <Card
            title="Click Trends"
            className="rounded-md shadow-sm"
            style={{ minHeight: 300 }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ResponsiveContainer width="95%" height={isMobile ? 250 : 300}>
                <LineChart data={clickTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    tickFormatter={(v) => dayjs(v).format("MM/DD")}
                  />
                  <YAxis />
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#1890ff"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title="Geographic Distribution"
            className="rounded-md shadow-sm"
            style={{ minHeight: 300 }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ResponsiveContainer width="95%" height={isMobile ? 250 : 300}>
                <BarChart data={geoData.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="clicks" fill="#722ed1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-8" justify="center" wrap>
        {[
          { data: deviceData, title: "Device Distribution" },
          { data: browserData, title: "Browser Distribution" },
        ].map((chart, index) => (
          <Col
            xs={24}
            md={12}
            key={index}
            style={{ maxWidth: 600, margin: "0 auto" }}
          >
            <Card title={chart.title} className="rounded-md shadow-sm">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: isMobile ? 250 : 300,
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chart.data}
                      cx="50%"
                      cy="50%"
                      outerRadius={isMobile ? 90 : 100}
                      dataKey="clicks"
                      nameKey={index === 0 ? "device" : "browser"}
                      label
                      labelLine={false}
                    >
                      {chart.data.map((entry, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={COLORS[idx % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Top Performing URLs" className="rounded-md shadow-sm">
        <Table
          columns={[
            {
              title: "Short URL",
              dataIndex: "short_url",
              render: (text) => (
                <a
                  href={`${BASE_URL}/${text}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: COLORS[0] }}
                >
                  {`${BASE_URL}/${text}`}
                </a>
              ),
            },
            {
              title: "Original URL",
              dataIndex: "full_url",
              ellipsis: true,
            },
            {
              title: "Clicks",
              dataIndex: "clicks",
              sorter: (a, b) => a.clicks - b.clicks,
              render: (clicks) => <Tag color="blue">{clicks}</Tag>,
            },
            {
              title: "Created",
              dataIndex: "createdAt",
              render: (d) => dayjs(d).format("MMM DD, YYYY"),
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
