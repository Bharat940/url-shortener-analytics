import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createShortUrl } from "../api/shortUrlApi.js";
import { useIsMobile } from "../hooks/useIsMobile.js";
import {
  Input,
  Button,
  Alert,
  Space,
  message,
  Tooltip,
  Popover,
  Checkbox,
} from "antd";
import { QrcodeOutlined, DownloadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const ShortenUrlForm = () => {
  const isMobile = useIsMobile();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [generateQR, setGenerateQR] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!url) {
      message.error("Please enter a valid URL");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await createShortUrl(
        url,
        isAuthenticated ? customSlug : "",
        isAuthenticated ? generateQR : false
      );
      setResult(data);

      if (isAuthenticated) {
        queryClient.setQueryData(["userUrls"], (oldData) => {
          if (!oldData) return { urls: [data] };
          return { urls: [data, ...oldData.urls] };
        });
      }

      message.success("URL created successfully!");
    } catch (err) {
      setError(err.message || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.short_url) {
      navigator.clipboard.writeText(result.short_url);
      setCopied(true);
      message.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadQrCode = () => {
    if (result?.qrcode_image) {
      const link = document.createElement("a");
      link.href = result.qrcode_image;
      link.download = `QRCode_${result.short_url}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      message.warning("No QR code available to download");
    }
  };

  // Consistent QR popover content
  const qrPopoverContent = result?.qrcode_image ? (
    <div className="text-center p-3 bg-white dark:bg-gray-800">
      <img
        src={result.qrcode_image}
        alt="QR Code"
        className={`mx-auto mb-3 rounded-lg ${
          isMobile ? "w-32 h-32" : "w-36 h-36"
        }`}
        style={{
          maxWidth: isMobile ? "128px" : "150px",
          height: "auto",
        }}
      />
      <Button
        icon={<DownloadOutlined />}
        size="small"
        type="primary"
        onClick={downloadQrCode}
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
    <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-xl shadow-md transition-colors duration-300 w-full max-w-md mx-auto">
      <h2 className="mb-4 text-xl font-bold">Shorten URL</h2>

      <Input
        placeholder="Enter URL to shorten"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        size="large"
        allowClear
        className="mb-4"
        type="url"
      />

      {isAuthenticated && (
        <Input
          placeholder="Custom Slug (Optional)"
          value={customSlug}
          onChange={(e) => setCustomSlug(e.target.value)}
          size="large"
          allowClear
          className="mb-4"
        />
      )}

      {isAuthenticated && (
        <Checkbox
          checked={generateQR}
          onChange={(e) => setGenerateQR(e.target.checked)}
          className="mb-4 text-gray-700 dark:text-gray-300"
        >
          Generate QR Code with URL
        </Checkbox>
      )}

      <Button type="primary" onClick={handleSubmit} loading={loading} block>
        Shorten URL
      </Button>

      {error && (
        <Alert message={error} type="error" showIcon className="mt-4" />
      )}

      {result && (
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input value={result.short_url} readOnly className="flex-1" />
            <div className="flex gap-2">
              <Button
                type={copied ? "default" : "default"}
                onClick={handleCopy}
                className={
                  copied ? "bg-green-500 text-white border-green-500" : ""
                }
              >
                {copied ? "Copied!" : "Copy"}
              </Button>

              {/* Consistent QR Code Icon with Popover */}
              <Popover
                content={qrPopoverContent}
                title={
                  <span className="text-gray-900 dark:text-gray-100">
                    QR Code
                  </span>
                }
                trigger={
                  result?.qrcode_image ? (isMobile ? "click" : "hover") : []
                }
                placement={isMobile ? "topLeft" : "leftTop"}
                styles={{
                  body: {
                    borderRadius: 8,
                    boxShadow:
                      "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                    width: 250,
                    padding: 0,
                  },
                }}
                align={{
                  offset: isMobile ? [0, -10] : [-10, 0],
                }}
              >
                <Tooltip
                  title={
                    result?.qrcode_image
                      ? "Show QR Code"
                      : "No QR Code available"
                  }
                >
                  <Button
                    icon={
                      <QrcodeOutlined
                        className={`transition-colors duration-200 ${
                          result?.qrcode_image
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                    }
                    className={`flex items-center justify-center ${
                      result?.qrcode_image
                        ? "hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        : "cursor-not-allowed opacity-60"
                    }`}
                    disabled={!result?.qrcode_image}
                  />
                </Tooltip>
              </Popover>

              <Button
                icon={<DownloadOutlined />}
                onClick={downloadQrCode}
                disabled={!result?.qrcode_image}
                className={`flex items-center justify-center ${
                  !result?.qrcode_image ? "opacity-60 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortenUrlForm;
