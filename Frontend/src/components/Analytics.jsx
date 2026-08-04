import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "../api/analytics.api.js";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { Link } from "@tanstack/react-router";
import {
  Row,
  Col,
  DatePicker,
  Select,
  Spin,
  Alert,
  Table,
  Tag,
  Button,
  message,
} from "antd";
import {
  BarChartOutlined,
  EyeOutlined,
  LinkOutlined,
  CalendarOutlined,
  LineChartOutlined,
  GlobalOutlined,
  PlusOutlined,
  CopyOutlined,
  RocketOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];
const BASE_URL = import.meta.env.VITE_APP_URL || "http://localhost:3000";

const PRESET_OPTIONS = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
  { label: "All Time", value: "all" },
  { label: "Custom", value: "custom" },
];

const Analytics = () => {
  const isMobile = useIsMobile();
  const [timePreset, setTimePreset] = useState("30d");
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);
  const [selectedUrl, setSelectedUrl] = useState("all");

  const isValidRange =
    Array.isArray(dateRange) && dateRange[0] != null && dateRange[1] != null;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["analytics", dateRange, selectedUrl],
    queryFn: () =>
      getAnalytics({
        start: dateRange[0].format("YYYY-MM-DD"),
        end: dateRange[1].format("YYYY-MM-DD"),
        urlId: selectedUrl === "all" ? null : selectedUrl,
      }),
    enabled: isValidRange,
    refetchInterval: 15000,
  });

  const handlePresetChange = (presetKey) => {
    setTimePreset(presetKey);
    if (presetKey === "7d") {
      setDateRange([dayjs().subtract(7, "day"), dayjs()]);
    } else if (presetKey === "30d") {
      setDateRange([dayjs().subtract(30, "day"), dayjs()]);
    } else if (presetKey === "90d") {
      setDateRange([dayjs().subtract(90, "day"), dayjs()]);
    } else if (presetKey === "all") {
      const allUrls = data?.urls || [];
      const earliestDate = allUrls.length > 0
        ? dayjs(allUrls.reduce((earliest, u) => new Date(u.createdAt) < new Date(earliest) ? u.createdAt : earliest, allUrls[0].createdAt))
        : dayjs().subtract(1, "year");
      setDateRange([earliestDate, dayjs()]);
    }
  };

  const onDateRangeChange = (dates) => {
    if (!dates || dates.length !== 2 || !dates[0] || !dates[1]) {
      setDateRange([dayjs().subtract(30, "day"), dayjs()]);
      setTimePreset("30d");
    } else {
      setDateRange(dates);
      setTimePreset("custom");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success("Link copied to clipboard! Paste it in a new tab to test clicking.");
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" tip="Loading Analytics Data..." />
      </div>
    );

  if (isError)
    return (
      <Alert
        message="Analytics Error"
        description={`Error loading analytics: ${error?.message || error}`}
        type="error"
        showIcon
        className="my-6 max-w-5xl mx-auto rounded-xl"
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
    urls = [],
  } = analytics;

  const hasNoUrls = !urls || urls.length === 0;
  const hasNoClicks = !summary.totalClicks || summary.totalClicks === 0;

  // Case 1: User has not created any URLs yet
  if (hasNoUrls) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Analytics Overview</h1>
        </div>

        <div className="ui-card p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center text-3xl">
            <BarChartOutlined />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold">No URLs Created Yet</h2>
            <p className="text-sm text-muted-foreground">
              You haven't shortened any links yet. Create your first short link or QR code to start tracking real-time click metrics!
            </p>
          </div>

          <Link to="/dashboard">
            <Button type="primary" size="large" icon={<PlusOutlined />} className="btn-primary font-semibold px-6">
              Create Your First Short Link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Analytics Overview
            </h1>
            {hasNoClicks && (
              <Tag color="orange" className="font-semibold text-xs px-2.5 py-0.5 rounded-full">
                Waiting for First Click
              </Tag>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time click insights, audience location, and device metrics.
          </p>
        </div>

        {/* Preset Time Range Pills & Filters */}
        <div className="ui-card p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Quick Preset Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {PRESET_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handlePresetChange(opt.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all shrink-0 cursor-pointer ${
                  timePreset === opt.value
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Custom Date Range Picker (Shown when Custom is selected) */}
          {timePreset === "custom" && (
            <RangePicker
              value={dateRange}
              onChange={onDateRangeChange}
              disabledDate={(current) => current && current > dayjs().endOf("day")}
              allowEmpty={[false, false]}
              className="rounded-md border-border w-full sm:w-auto"
              size={isMobile ? "small" : "middle"}
            />
          )}

          {/* URL Filter Dropdown */}
          <Select
            value={selectedUrl}
            onChange={setSelectedUrl}
            placeholder="Filter by URL"
            showSearch
            options={[
              { label: "All URLs", value: "all" },
              ...(urls || []).map(({ _id, short_url, clicks }) => ({
                label: `${short_url} (${clicks} clicks)`,
                value: _id,
              })),
            ]}
            optionFilterProp="label"
            className="w-full sm:w-48 shrink-0"
            size={isMobile ? "small" : "middle"}
          />
        </div>
      </div>

      {/* Guide Banner when URLs exist but clicks = 0 */}
      {hasNoClicks && (
        <div className="ui-card p-6 border-l-4 border-l-amber-500 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <RocketOutlined className="text-amber-500 text-lg" />
                <h2 className="text-base sm:text-lg font-bold">Your Short Links Are Ready!</h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                You have created <strong>{urls.length} link{urls.length > 1 ? "s" : ""}</strong>, but no clicks have been recorded yet. Click any link below to test it and watch your charts update live!
              </p>
            </div>
            {topUrls.length > 0 && (
              <Button
                type="primary"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(`${BASE_URL}/${topUrls[0].short_url}`)}
                className="btn-primary shrink-0 font-semibold"
              >
                Copy {topUrls[0].short_url} & Test
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-border">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center text-xs shrink-0">
                1
              </div>
              <div>
                <div className="text-xs font-bold">Copy Your Short Link</div>
                <div className="text-[11px] text-muted-foreground">Copy links from the table below or your dashboard.</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center text-xs shrink-0">
                2
              </div>
              <div>
                <div className="text-xs font-bold">Open or Share</div>
                <div className="text-[11px] text-muted-foreground">Open in a new tab or send to a colleague/device.</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center text-xs shrink-0">
                3
              </div>
              <div>
                <div className="text-xs font-bold">See Live Charts</div>
                <div className="text-[11px] text-muted-foreground">Click data, country stats & device breakdown update live.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <Row gutter={[12, 12]}>
        {[
          {
            title: "Total Clicks",
            value: summary.totalClicks ?? 0,
            icon: <EyeOutlined className="text-xl sm:text-2xl text-emerald-600 dark:text-emerald-400" />,
            bgColor: "bg-emerald-500/10",
          },
          {
            title: "Total URLs",
            value: summary.totalUrls ?? urls.length,
            icon: <LinkOutlined className="text-xl sm:text-2xl text-indigo-600 dark:text-indigo-400" />,
            bgColor: "bg-indigo-500/10",
          },
          {
            title: "Avg Clicks / URL",
            value: summary.avgClickPerUrl ?? summary.avgClicksPerUrl ?? 0,
            icon: <BarChartOutlined className="text-xl sm:text-2xl text-purple-600 dark:text-purple-400" />,
            bgColor: "bg-purple-500/10",
          },
          {
            title: "Active URLs",
            value: summary.activeUrls ?? 0,
            icon: <CalendarOutlined className="text-xl sm:text-2xl text-pink-600 dark:text-pink-400" />,
            bgColor: "bg-pink-500/10",
          },
        ].map((stat, idx) => (
          <Col xs={12} sm={6} key={idx}>
            <div className="ui-card p-4 sm:p-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  {stat.title}
                </div>
                <div className="text-xl sm:text-3xl font-extrabold text-foreground">
                  {stat.value}
                </div>
              </div>
              <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg ${stat.bgColor} flex items-center justify-center shrink-0`}>
                {stat.icon}
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Charts Grid */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <div className="ui-card p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 font-bold text-base sm:text-lg">
              <LineChartOutlined className="text-primary" /> Click Trends Over Time
            </div>
            <div className={isMobile ? "h-[220px]" : "h-[280px]"}>
              {clickTrends && clickTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={clickTrends}>
                    <defs>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: isMobile ? 8 : 10 }}
                      tickFormatter={(v) =>
                        timePreset === "all" || timePreset === "90d"
                          ? dayjs(v).format("MMM D, 'YY")
                          : dayjs(v).format("MMM D")
                      }
                    />
                    <YAxis tick={{ fontSize: isMobile ? 9 : 11 }} />
                    <RechartsTooltip labelFormatter={(v) => dayjs(v).format("MMM DD, YYYY")} />
                    <Area type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorClicks)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2 p-6 text-center">
                  <InboxOutlined className="text-3xl text-amber-500" />
                  <span className="text-xs font-semibold text-foreground">No clicks recorded in this period</span>
                  <span className="text-[11px] text-muted-foreground max-w-xs">
                    Click one of your short links below to record your first live data point!
                  </span>
                </div>
              )}
            </div>
          </div>
        </Col>

        <Col xs={24} lg={12}>
          <div className="ui-card p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 font-bold text-base sm:text-lg">
              <GlobalOutlined className="text-primary" /> Geographic Distribution
            </div>
            <div className={isMobile ? "h-[220px]" : "h-[280px]"}>
              {geoData && geoData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={geoData.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="country" tick={{ fontSize: isMobile ? 9 : 11 }} />
                    <YAxis tick={{ fontSize: isMobile ? 9 : 11 }} />
                    <RechartsTooltip />
                    <Bar dataKey="clicks" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2 p-6 text-center">
                  <InboxOutlined className="text-3xl text-amber-500" />
                  <span className="text-xs font-semibold text-foreground">No geographic data recorded yet</span>
                  <span className="text-[11px] text-muted-foreground max-w-xs">
                    Geographical data will automatically track visitor country when links are clicked.
                  </span>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* Donut Distribution Charts */}
      <Row gutter={[16, 16]}>
        {[
          { data: deviceData, title: "Device Breakdown", keyName: "device" },
          { data: browserData, title: "Browser Distribution", keyName: "browser" },
        ].map((chart, index) => (
          <Col xs={24} md={12} key={index}>
            <div className="ui-card p-4 sm:p-6 space-y-4">
              <div className="font-bold text-base sm:text-lg">{chart.title}</div>
              <div className={isMobile ? "h-[220px] flex items-center justify-center" : "h-[250px] flex items-center justify-center"}>
                {chart.data && chart.data.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chart.data}
                        cx="50%"
                        cy="50%"
                        innerRadius={isMobile ? 45 : 60}
                        outerRadius={isMobile ? 70 : 90}
                        paddingAngle={4}
                        dataKey="clicks"
                        nameKey={chart.keyName}
                        label
                      >
                        {chart.data.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2 p-6 text-center">
                    <InboxOutlined className="text-3xl text-amber-500" />
                    <span className="text-xs font-semibold text-foreground">No {chart.title.toLowerCase()} recorded yet</span>
                    <span className="text-[11px] text-muted-foreground max-w-xs">
                      Tracks mobile vs desktop and browser breakdown upon first click.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Top Performing URLs Table */}
      <div className="ui-card p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="font-bold text-base sm:text-lg">Your Shortened Links & Click Counts</div>
          <span className="text-xs text-muted-foreground">Showing {urls.length} links</span>
        </div>
        <Table
          columns={[
            {
              title: "Short URL",
              dataIndex: "short_url",
              render: (text) => (
                <div className="flex items-center gap-2">
                  <a href={`${BASE_URL}/${text}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary">
                    {`${BASE_URL}/${text}`}
                  </a>
                  <Button
                    type="text"
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(`${BASE_URL}/${text}`)}
                  />
                </div>
              ),
            },
            {
              title: "Original Destination",
              dataIndex: "full_url",
              ellipsis: true,
            },
            {
              title: "Clicks",
              dataIndex: "clicks",
              sorter: (a, b) => a.clicks - b.clicks,
              render: (clicks) => <Tag color={clicks > 0 ? "blue" : "default"} className="font-bold">{clicks}</Tag>,
            },
            {
              title: "Created Date",
              dataIndex: "createdAt",
              render: (d) => dayjs(d).format("MMM DD, YYYY"),
            },
          ]}
          dataSource={topUrls.length > 0 ? topUrls : urls}
          pagination={{ pageSize: 5 }}
          rowKey={(record) => record._id}
          size={isMobile ? "small" : "middle"}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
};

export default Analytics;
