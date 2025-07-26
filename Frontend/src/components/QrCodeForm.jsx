import React, { useState } from "react";
import { createShortUrl } from "../api/shortUrlApi.js";
import { Button, Input, Alert, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const QrCodeForm = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!url) {
      message.error("Please enter a valid URL");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await createShortUrl(url, "", true);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result?.qrcode_image) {
      const link = document.createElement("a");
      link.href = result.qrcode_image;
      link.download = `QRCode_${result.short_url}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-colors duration-300">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
        Create QR Code
      </h2>
      <Input
        placeholder="Enter URL for QR code"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        size="large"
        allowClear
        className="mb-4"
        type="url"
      />
      <Button type="primary" onClick={handleSubmit} loading={loading} block>
        Generate QR Code
      </Button>

      {error && (
        <Alert message={error} type="error" showIcon className="mt-4" />
      )}

      {result?.qrcode_image && (
        <div className="mt-4 text-center">
          <img
            src={result.qrcode_image}
            alt="Generated QR Code"
            className="mx-auto mb-2"
            style={{ maxWidth: "180px", height: "auto" }}
          />
          <div className="mb-2">
            <a
              href={result.short_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline break-words"
            >
              {result.short_url}
            </a>
          </div>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
          >
            Download QR Code
          </Button>
        </div>
      )}
    </div>
  );
};

export default QrCodeForm;
