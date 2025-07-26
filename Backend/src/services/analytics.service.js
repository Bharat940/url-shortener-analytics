import Click from "../models/click.model.js";
import ShortUrl from "../models/shortUrl.model.js";
import moment from "moment";

export const getAnalyticsService = async (userId, filters = {}) => {
  const { startDate, endDate, urlId, period = "last30days" } = filters;

  const urlQuery = { user: userId };
  if (urlId && urlId !== "all") {
    urlQuery._id = urlId;
  }

  const userUrls = await ShortUrl.find(urlQuery);
  const urlIds = userUrls.map((url) => url._id);

  if (urlIds.length === 0) {
    return getEmptyAnalytics();
  }

  let dateRange = {};
  if (startDate && endDate) {
    dateRange = {
      timestamp: {
        $gte: new Date(startDate),
        $lte: new Date(endDate + "T23:59:59.999Z"),
      },
    };
  } else {
    dateRange = {
      timestamp: {
        $gte: moment().subtract(30, "days").startOf("day").toDate(),
        $lte: moment().endOf("day").toDate(),
      },
    };
  }

  const totalUrls = userUrls.length;
  const totalClicks = userUrls.reduce((sum, url) => sum + url.clicks, 0);
  const activeUrls = userUrls.filter((url) => url.clicks > 0).length;
  const avgClicksPerUrl =
    totalUrls > 0 ? (totalClicks / totalUrls).toFixed(1) : 0;

  const clickTrends = await Click.aggregate([
    {
      $match: {
        url: { $in: urlIds },
        ...dateRange,
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
        },
        clicks: { $sum: 1 },
      },
    },
    { $sort: { "_id.date": 1 } },
    {
      $project: {
        date: "$_id.date",
        clicks: 1,
        _id: 0,
      },
    },
  ]);

  const geoData = await Click.aggregate([
    {
      $match: {
        url: { $in: urlIds },
        ...dateRange,
      },
    },
    {
      $group: {
        _id: "$country",
        clicks: { $sum: 1 },
      },
    },
    { $sort: { clicks: -1 } },
    { $limit: 10 },
    {
      $project: {
        country: "$_id",
        clicks: 1,
        _id: 0,
      },
    },
  ]);

  const deviceData = await Click.aggregate([
    {
      $match: {
        url: { $in: urlIds },
        ...dateRange,
      },
    },
    {
      $group: {
        _id: "$device",
        clicks: { $sum: 1 },
      },
    },
    { $sort: { clicks: -1 } },
    {
      $project: {
        device: "$_id",
        clicks: 1,
        _id: 0,
      },
    },
  ]);

  const browserData = await Click.aggregate([
    {
      $match: {
        url: { $in: urlIds },
        ...dateRange,
      },
    },
    {
      $group: {
        _id: "$browser",
        clicks: { $sum: 1 },
      },
    },
    { $sort: { clicks: -1 } },
    { $limit: 10 },
    {
      $project: {
        browser: "$_id",
        clicks: 1,
        _id: 0,
      },
    },
  ]);

  const topUrls = userUrls
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10)
    .map((url) => ({
      _id: url._id,
      short_url: url.short_url,
      full_url: url.full_url,
      clicks: url.clicks,
      createdAt: url.createdAt,
    }));

  const recentClicks = await Click.find({
    url: { $in: urlIds },
  })
    .populate("url", "short_url full_url")
    .sort({ timestamp: -1 })
    .limit(100)
    .select("ip country city device browser timestamp url");

  return {
    summary: {
      totalClicks,
      totalUrls,
      activeUrls,
      avgClicksPerUrl: parseFloat(avgClicksPerUrl),
    },
    clickTrends,
    geoData,
    deviceData,
    browserData,
    topUrls,
    recentClicks,
    urls: userUrls,
  };
};

export const getUrlAnalyticsService = async (urlId, userId) => {
  const url = await ShortUrl.findOne({ _id: urlId, user: userId });
  if (!url) {
    throw new Error("URL not found or unauthorized");
  }

  const last30Days = moment().subtract(30, "days").startOf("day").toDate();

  const dailyClicks = await Click.aggregate([
    {
      $match: {
        url: url._id,
        timestamp: { $gte: last30Days },
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
        },
        clicks: { $sum: 1 },
      },
    },
    { $sort: { "_id.date": 1 } },
  ]);

  const geoDistribution = await Click.aggregate([
    { $match: { url: url._id } },
    {
      $group: {
        _id: { country: "$country", city: "$city" },
        clicks: { $sum: 1 },
      },
    },
    { $sort: { clicks: -1 } },
    { $limit: 20 },
  ]);

  const deviceStats = await Click.aggregate([
    { $match: { url: url._id } },
    {
      $group: {
        _id: "$device",
        clicks: { $sum: 1 },
      },
    },
  ]);

  return {
    url,
    dailyClicks,
    geoDistribution,
    deviceStats,
    totalClicks: url.clicks,
  };
};

const getEmptyAnalytics = () => ({
  summary: {
    totalClicks: 0,
    totalUrls: 0,
    activeUrls: 0,
    avgClicksPerUrl: 0,
  },
  clickTrends: [],
  geoData: [],
  deviceData: [],
  browserData: [],
  topUrls: [],
  recentClicks: [],
  urls: [],
});
