import Click from "../models/click.model.js";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";

export const recordClick = async (urlId, req) => {
  try {
    let ip =
      req.ip || req.connection.remoteAddress || req.headers["x-forwarded-for"];
    const userAgent = req.headers["user-agent"] || "";
    const referer = req.headers.referer || req.headers.referrer || "";

    ip = ip.replace(/^::ffff:/, "").replace(/^::1$/, "127.0.0.1");

    const geo = geoip.lookup(ip) || {};

    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    let device = "desktop";
    if (result.device.type === "mobile") device = "mobile";
    else if (result.device.type === "tablet") device = "tablet";

    const clickData = new Click({
      url: urlId,
      ip: ip,
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
