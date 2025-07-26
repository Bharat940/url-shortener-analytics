import {
  getAnalyticsService,
  getUrlAnalyticsService,
} from "../services/analytics.service.js";
import wrapAsync from "../utils/tryCatchWraper.js";

export const getAnalytics = wrapAsync(async (req, res) => {
  const { startDate, endDate, urlId, period } = req.query;
  const userId = req.user._id;

  const analytics = await getAnalyticsService(userId, {
    startDate,
    endDate,
    urlId,
    period,
  });

  res.status(200).json({
    success: true,
    data: analytics,
  });
});

export const getUrlAnalytics = wrapAsync(async (req, res) => {
  const { urlId } = req.params;
  const userId = req.user._id;

  const analytics = await getUrlAnalyticsService(urlId, userId);

  res.status(200).json({
    success: true,
    data: analytics,
  });
});
