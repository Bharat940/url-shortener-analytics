import Click from "../models/click.model.js";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";

export const recordClick = async (urlId, req) => {
  try {
    let ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.ip || req.connection.remoteAddress || "127.0.0.1";

    ip = ip.replace(/^::ffff:/, "");

    const privateIpRanges = [
      /^10\./,
      /^192\.168\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^127\./,
      /^::1$/,
    ];

    let geo;
    if (privateIpRanges.some((reg) => reg.test(ip))) {
      geo = { country: "Private", city: "Private Network" };
    } else {
      geo = geoip.lookup(ip) || {};
    }

    const userAgent = req.headers["user-agent"] || "";
    const referer = req.headers.referer || req.headers.referrer || "";

    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    let device = "desktop";
    if (result.device.type === "mobile") device = "mobile";
    else if (result.device.type === "tablet") device = "tablet";

    const clickData = new Click({
      url: urlId,
      ip,
      userAgent,
      referer,
      country: geo.country || "Unknown",
      city: geo.city || "Unknown",
      device,
      browser: result.browser.name || "Unknown",
      os: result.os.name || "Unknown",
    });

    await clickData.save();
    return clickData;
  } catch (error) {
    console.error("Error recording click:", error);
  }
};
