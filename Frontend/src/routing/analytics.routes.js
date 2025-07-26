import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import Analytics from "../components/Analytics";
import { checkAuth } from "../utils/helper";

export const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics",
  component: Analytics,
  beforeLoad: checkAuth,
});
