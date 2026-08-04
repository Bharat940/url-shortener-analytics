import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createShortUrl } from "../api/shortUrlApi.js";
import { useIsMobile } from "../hooks/useIsMobile.js";
import {
  Input,
  Button,
  Alert,
  message,
  Tooltip,
  Popover,
  Checkbox,
} from "antd";
import { normalizeUrl, isValidUrl } from "../utils/urlHelper.js";
import {
  QrcodeOutlined,
  DownloadOutlined,
  LinkOutlined,
  TagOutlined,
  CopyOutlined,
  CheckOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const ShortenUrlForm = () => {
  const isMobile = useIsMobile();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState(null);
  const [customSlug, setCustomSlug] = useState("");
  const [generateQR, setGenerateQR] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const queryClient = useQueryClient();

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
      const data = await createShortUrl(
        normalizedUrl,
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

      message.success("URL shortened successfully!");
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
      message.success("Short URL copied!");
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

  const qrPopoverContent = result?.qrcode_image ? (
    <div className="text-center p-3 bg-card text-card-foreground rounded-lg w-max max-w-[220px]">
      <img
        src={result.qrcode_image}
        alt="QR Code"
        className="mx-auto mb-3 rounded-lg border border-border w-32 h-32"
        style={{ height: "auto" }}
      />
      <Button
        icon={<DownloadOutlined />}
        size="small"
        type="primary"
        onClick={downloadQrCode}
        className="w-full btn-primary font-semibold"
      >
        Download PNG
      </Button>
    </div>
  ) : (
    <div className="text-center p-2 text-xs text-muted-foreground">
      No QR Code Available
    </div>
  );

  return (
    <div className="w-full space-y-4">
      <div>
        <h3 className="text-lg font-bold text-foreground">Shorten URL</h3>
        <p className="text-xs text-muted-foreground">
          Enter a long web link to generate a clean short URL.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <Input
            prefix={<LinkOutlined className="text-muted-foreground mr-1" />}
            placeholder="https://example.com/very-long-url-path"
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

        {isAuthenticated && (
          <Input
            prefix={<TagOutlined className="text-muted-foreground mr-1" />}
            placeholder="Custom slug (e.g. my-custom-link)"
            value={customSlug}
            onChange={(e) => setCustomSlug(e.target.value)}
            size="large"
            allowClear
            className="rounded-md"
          />
        )}

        {isAuthenticated && (
          <div className="pt-1">
            <Checkbox
              checked={generateQR}
              onChange={(e) => setGenerateQR(e.target.checked)}
              className="text-xs text-muted-foreground font-medium"
            >
              Generate dynamic QR code alongside short URL
            </Checkbox>
          </div>
        )}

        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          block
          className="btn-primary h-11 text-base font-semibold flex items-center justify-center gap-2"
        >
          Shorten URL <ArrowRightOutlined className="text-xs" />
        </Button>
      </div>

      {error && (
        <Alert message={error} type="error" showIcon className="mt-3 text-xs" />
      )}

      {result && (
        <div className="mt-4 p-4 rounded-xl bg-secondary/80 border border-border space-y-3">
          <div className="text-xs font-bold text-foreground uppercase tracking-wider">
            Your Shortened Link:
          </div>

          <div className="flex items-center gap-2">
            <Input
              value={result.short_url}
              readOnly
              className="font-semibold text-primary rounded-md flex-1"
            />
            <Button
              type={copied ? "default" : "primary"}
              icon={copied ? <CheckOutlined /> : <CopyOutlined />}
              onClick={handleCopy}
              className={copied ? "bg-emerald-600 text-white border-emerald-600 font-semibold" : "btn-primary font-semibold"}
            >
              {copied ? "Copied" : "Copy"}
            </Button>

            {result?.qrcode_image && (
              <Popover
                content={qrPopoverContent}
                title={<span className="font-bold text-xs">QR Preview</span>}
                trigger={isMobile ? "click" : "hover"}
                placement="topRight"
              >
                <Button
                  icon={<QrcodeOutlined className="text-primary text-base" />}
                  className="flex items-center justify-center border-border hover:bg-secondary"
                />
              </Popover>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortenUrlForm;
