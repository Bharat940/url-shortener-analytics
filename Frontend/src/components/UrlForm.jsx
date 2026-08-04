import React from "react";
import { useSelector } from "react-redux";
import ShortenUrlForm from "./ShortenUrlForm";
import QrCodeForm from "./QrCodeForm";
import { Alert } from "antd";
import { SafetyCertificateOutlined } from "@ant-design/icons";

const UrlForm = React.memo(() => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {!isAuthenticated && (
        <Alert
          type="warning"
          message={
            <span className="text-xs sm:text-sm">
              <SafetyCertificateOutlined className="mr-1 text-amber-500" />
              <strong>Guest Mode:</strong> You can create up to 20 combined short URLs and QR codes per day. Register to unlock custom slugs and unlimited link shortening.
            </span>
          }
          className="rounded-lg border border-amber-500/30 bg-amber-500/10 text-foreground"
        />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="ui-card p-6 shadow-sm">
          <ShortenUrlForm />
        </div>
        <div className="ui-card p-6 shadow-sm">
          <QrCodeForm />
        </div>
      </div>
    </div>
  );
});

export default UrlForm;
