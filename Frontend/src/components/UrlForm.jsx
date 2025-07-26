import React from "react";
import { useSelector } from "react-redux";
import ShortenUrlForm from "./ShortenUrlForm";
import QrCodeForm from "./QrCodeForm";
import { Card, Alert } from "antd";

const UrlForm = React.memo(() => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {!isAuthenticated && (
        <Alert
          type="info"
          message="Guest users can create up to 10 URLs and generate QR code per hour. Register to unlock custom slugs and unlimited generation."
          showIcon
          className="text-center"
          banner
        />
      )}

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="w-full rounded-xl shadow-lg">
          <ShortenUrlForm />
        </Card>
        <Card className="w-full rounded-xl shadow-lg">
          <QrCodeForm />
        </Card>
      </div>
    </div>
  );
});

export default UrlForm;
