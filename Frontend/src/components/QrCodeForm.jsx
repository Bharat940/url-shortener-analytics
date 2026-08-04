import React, { useState } from "react";
import { createShortUrl } from "../api/shortUrlApi.js";
import { Button, Input, Alert, message } from "antd";
import {
  DownloadOutlined,
  QrcodeOutlined,
  LinkOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { normalizeUrl, isValidUrl } from "../utils/urlHelper.js";

const QrCodeForm = () => {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateUrl = (val) => {
    const normalized = normalizeUrl(val);
    if (!val) {
      setUrlError(null);
      return false;
    }
    if (!isValidUrl(normalized)) {
      setUrlError("Please enter a valid URL (e.g. https://example.com)");
      return false;
    }
    setUrlError(null);
    return true;
  };

  const handleChange = (e) => {
    setUrl(e.target.value);
    validateUrl(e.target.value);
  };

  const handleSubmit = async () => {
    const normalizedUrl = normalizeUrl(url);

    if (!validateUrl(url)) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await createShortUrl(normalizedUrl, "", true);
      setResult(data);
      message.success("QR Code generated successfully!");
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
    <div className="w-full space-y-4">
      <div>
        <h3 className="text-lg font-bold text-foreground">Generate QR Code</h3>
        <p className="text-xs text-muted-foreground">
          Enter any URL to produce an instant high-resolution PNG QR code.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <Input
            prefix={<LinkOutlined className="text-muted-foreground mr-1" />}
            placeholder="https://example.com"
            value={url}
            onChange={handleChange}
            size="large"
            allowClear
            type="url"
            className="rounded-md"
          />
          {urlError && (
            <Alert message={urlError} type="error" showIcon className="mt-2 text-xs" />
          )}
        </div>

        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          block
          className="btn-primary h-11 text-base font-semibold flex items-center justify-center gap-2"
        >
          <QrcodeOutlined /> Generate QR Code <ArrowRightOutlined className="text-xs" />
        </Button>
      </div>

      {error && (
        <Alert message={error} type="error" showIcon className="mt-3 text-xs" />
      )}

      {result?.qrcode_image && (
        <div className="mt-4 p-4 rounded-xl bg-secondary/80 border border-border text-center space-y-3">
          <img
            src={result.qrcode_image}
            alt="Generated QR Code"
            className="mx-auto rounded-lg border border-border shadow-xs max-w-[160px] h-auto"
          />
          <div className="text-xs text-muted-foreground break-words">
            Short URL:{" "}
            <a
              href={result.short_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline"
            >
              {result.short_url}
            </a>
          </div>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            className="btn-primary font-semibold w-full"
          >
            Download High-Res PNG
          </Button>
        </div>
      )}
    </div>
  );
};

export default QrCodeForm;
