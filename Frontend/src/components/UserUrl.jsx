import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUserUrls } from "../api/user.api.js";
import { useIsMobile } from "../hooks/useIsMobile.js";
import {
  Alert,
  Button,
  Spin,
  Tag,
  message,
  Table,
  Tooltip,
  Popover,
  Select,
  Space,
} from "antd";
import {
  QrcodeOutlined,
  DownloadOutlined,
  CopyOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Link } from "@tanstack/react-router";

const baseUrl = import.meta.env.VITE_APP_URL || "http://localhost:3000";

const UserUrl = () => {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userUrls"],
    queryFn: getAllUserUrls,
    refetchInterval: 30000,
  });
  const [copiedId, setCopiedId] = useState(null);

  const [mobileSortField, setMobileSortField] = useState("createdAt");
  const [mobileSortOrder, setMobileSortOrder] = useState("desc");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: isMobile ? 5 : 8,
    showSizeChanger: !isMobile,
    pageSizeOptions: ["5", "8", "10", "20", "50"],
    showQuickJumper: !isMobile,
    showTotal: (total, range) =>
      isMobile
        ? `${range[0]}-${range[1]} / ${total}`
        : `${range[0]}-${range[1]} of ${total} items`,
    size: isMobile ? "small" : "default",
  });

  const handleCopy = useCallback((url, id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      message.success("URL copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      message.error("Clipboard API not supported");
    }
  }, []);

  const handleTableChange = (paginationConfig, filters, sorter) => {
    setPagination({
      ...pagination,
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
    });
  };

  const sortMobileData = (data) => {
    if (!isMobile) return data;

    return [...data].sort((a, b) => {
      let aValue, bValue;

      switch (mobileSortField) {
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "clicks":
          aValue = a.clicks;
          bValue = b.clicks;
          break;
        case "full_url":
          aValue = a.full_url.toLowerCase();
          bValue = b.full_url.toLowerCase();
          break;
        case "short_url":
          aValue = a.short_url.toLowerCase();
          bValue = b.short_url.toLowerCase();
          break;
        default:
          return 0;
      }

      if (mobileSortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  };

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
        description={`Error loading your URLs: ${error.message}`}
        type="error"
        showIcon
        className="my-4 max-w-5xl mx-auto"
      />
    );

  const urls = data?.urls || [];

  if (urls.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 my-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-w-5xl mx-auto">
        <p className="text-lg font-medium mb-2">No URLs Found</p>
        <p>You haven't created any shortened URLs yet.</p>
      </div>
    );
  }

  const MobileSortControls = () => (
    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col space-y-2">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Sort by:
        </div>
        <Space.Compact style={{ width: "100%" }}>
          <Select
            value={mobileSortField}
            onChange={setMobileSortField}
            style={{ flex: 1 }}
            options={[
              { label: "Created Date", value: "createdAt" },
              { label: "Clicks", value: "clicks" },
              { label: "Original URL", value: "full_url" },
              { label: "Short URL", value: "short_url" },
            ]}
            popupMatchSelectWidth={false}
          />

          <Button
            icon={
              mobileSortOrder === "asc" ? (
                <SortAscendingOutlined />
              ) : (
                <SortDescendingOutlined />
              )
            }
            onClick={() =>
              setMobileSortOrder(mobileSortOrder === "asc" ? "desc" : "asc")
            }
            title={`Sort ${
              mobileSortOrder === "asc" ? "Ascending" : "Descending"
            }`}
          />
        </Space.Compact>
      </div>
    </div>
  );

  const mobileColumns = [
    {
      title: "URL Details",
      key: "mobile_view",
      render: (_, record) => {
        const fullShortUrl = `${baseUrl}/${record.short_url}`;
        const qrCodeImage = record.qrcode_image;

        return (
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Original URL:
              </div>
              <a
                href={record.full_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 text-sm break-words"
                style={{ wordBreak: "break-word" }}
              >
                {record.full_url.length > 100
                  ? `${record.full_url.substring(0, 100)}...`
                  : record.full_url}
              </a>
            </div>

            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Short URL:
              </div>
              <a
                href={fullShortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 text-sm break-words"
                style={{ wordBreak: "break-word" }}
              >
                {fullShortUrl}
              </a>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <Tag
                size="small"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {record.clicks} {record.clicks === 1 ? "click" : "clicks"}
              </Tag>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(record.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex gap-2 pt-2 flex-wrap sm:flex-nowrap">
              <Button
                size="small"
                icon={<CopyOutlined />}
                type={copiedId === record._id ? "primary" : "default"}
                onClick={() => handleCopy(fullShortUrl, record._id)}
                className={`flex-grow sm:flex-grow-0 ${
                  copiedId === record._id
                    ? "bg-green-500 text-white border-green-500"
                    : ""
                }`}
              >
                {copiedId === record._id ? "Copied!" : "Copy"}
              </Button>

              {qrCodeImage && (
                <Popover
                  content={
                    <div className="text-center p-2">
                      <img
                        src={qrCodeImage}
                        alt="QR Code"
                        className="w-32 h-32 mx-auto mb-2 rounded-lg"
                      />
                      <Button
                        icon={<DownloadOutlined />}
                        size="small"
                        type="primary"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = qrCodeImage;
                          link.download = `QRCode_${record.short_url}.png`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        block
                      >
                        Download
                      </Button>
                    </div>
                  }
                  title="QR Code"
                  trigger="click"
                  placement="top"
                >
                  <Button size="small" icon={<QrcodeOutlined />}>
                    QR
                  </Button>
                </Popover>
              )}
            </div>
          </div>
        );
      },
    },
  ];

  const desktopColumns = [
    {
      title: "Original URL",
      dataIndex: "full_url",
      key: "full_url",
      width: "30%",
      responsive: ["md"],
      render: (text) => (
        <a
          href={text}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate block max-w-xs underline text-blue-600 dark:text-blue-400"
          aria-label={`Original URL: ${text}`}
        >
          {text}
        </a>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Short URL",
      dataIndex: "short_url",
      key: "short_url",
      width: "25%",
      responsive: ["sm"],
      render: (text) => {
        const fullShortUrl = `${baseUrl}/${text}`;
        return (
          <a
            href={fullShortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-500"
            aria-label={`Shortened URL: ${fullShortUrl}`}
          >
            <span className="truncate max-w-xs inline-block">
              {fullShortUrl}
            </span>
          </a>
        );
      },
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "15%",
      responsive: ["md"],
      render: (date) => (
        <span className="text-gray-700 dark:text-gray-300">
          {new Date(date).toLocaleDateString()}
        </span>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: "descend",
    },
    {
      title: "Clicks",
      dataIndex: "clicks",
      key: "clicks",
      width: "10%",
      responsive: ["sm"],
      render: (count) => (
        <Tag className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {count}
        </Tag>
      ),
      sorter: (a, b) => a.clicks - b.clicks,
    },
    {
      title: "QR Code",
      key: "qrcode",
      align: "center",
      width: "10%",
      responsive: ["md"],
      render: (_, record) => {
        const qrCodeImage = record.qrcode_image;
        const qrPopoverContent = qrCodeImage ? (
          <div className="text-center p-3 bg-white dark:bg-gray-800">
            <img
              src={qrCodeImage}
              alt="QR Code"
              className="w-36 h-36 mx-auto mb-3 rounded-lg"
            />
            <Button
              icon={<DownloadOutlined />}
              size="small"
              type="primary"
              onClick={() => {
                const link = document.createElement("a");
                link.href = qrCodeImage;
                link.download = `QRCode_${record.short_url}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="w-full"
            >
              Download QR Code
            </Button>
          </div>
        ) : (
          <div className="text-center p-3 text-gray-500 dark:text-gray-400">
            No QR Code Available
          </div>
        );

        return (
          <Popover
            content={qrPopoverContent}
            title={
              <span className="text-gray-900 dark:text-gray-100">QR Code</span>
            }
            trigger={qrCodeImage ? "hover" : []}
            placement="leftTop"
            destroyPopupOnHide
            align={{
              offset: [-10, 0],
            }}
          >
            <Tooltip
              title={qrCodeImage ? "Show QR Code" : "No QR Code available"}
            >
              <QrcodeOutlined
                className={`text-2xl transition-colors duration-200 ${
                  qrCodeImage
                    ? "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer"
                    : "text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
                }`}
              />
            </Tooltip>
          </Popover>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      align: "center",
      render: (_, record) => {
        const fullShortUrl = `${baseUrl}/${record.short_url}`;
        return (
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/analytics" search={{ urlId: record._id }}>
              <Button
                size="small"
                icon={<BarChartOutlined />}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                title="View Analytics"
              >
                {!isMobile && "Analytics"}
              </Button>
            </Link>
            <Button
              size="small"
              type={copiedId === record._id ? "primary" : "default"}
              onClick={() => handleCopy(fullShortUrl, record._id)}
              aria-label={`Copy short URL ${fullShortUrl} to clipboard`}
              className={`transition-all duration-200 ${
                copiedId === record._id
                  ? "bg-green-500 text-white border-green-500"
                  : "hover:bg-gray-50 dark:hover:bg-gray-600"
              }`}
            >
              {copiedId === record._id ? "Copied!" : "Copy"}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full max-w-full overflow-x-auto sm:overflow-x-visible  mx-auto px-2 sm:px-0">
      {isMobile && <MobileSortControls />}

      <Table
        columns={isMobile ? mobileColumns : desktopColumns}
        dataSource={
          isMobile
            ? sortMobileData(urls).slice(
                (pagination.current - 1) * pagination.pageSize,
                pagination.current * pagination.pageSize
              )
            : urls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        }
        rowKey={(record) => record._id}
        pagination={pagination}
        onChange={handleTableChange}
        className="w-full"
        scroll={isMobile ? { x: "100%" } : { x: 900 }}
        size={isMobile ? "small" : "default"}
        showHeader={!isMobile}
        aria-label="User shortened URLs table"
        bordered
      />
    </div>
  );
};

export default UserUrl;
