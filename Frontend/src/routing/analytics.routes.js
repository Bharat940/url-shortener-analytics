import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree.js";
import Analytics from "../components/Analytics.jsx";
import { checkAuth } from "../utils/helper.js";

export const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics",
  component: Analytics,
  beforeLoad: checkAuth,
});
