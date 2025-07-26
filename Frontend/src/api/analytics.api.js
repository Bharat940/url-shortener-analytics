import axiosInstance from "../utils/axiosInstance";

export const getAnalytics = async (params = {}) => {
  const { startDate, endDate, urlId, period } = params;
  const queryParams = new URLSearchParams();

  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (urlId) queryParams.append("urlId", urlId);
  if (period) queryParams.append("period", period);

  const response = await axiosInstance.get(`/api/analytics?${queryParams}`);
  return response.data.data;
};

export const getUrlAnalytics = async (urlId) => {
  const response = await axiosInstance.get(`/api/analytics/url/${urlId}`);
  return response.data.data;
};
