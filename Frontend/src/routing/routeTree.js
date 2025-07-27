import { createRootRoute } from "@tanstack/react-router";
import { homePageRoute } from "./homepage";
import { authRoute } from "./auth.routes.js";
import { analyticsRoute } from "./analytics.routes.js";
import { dashboardRoute } from "./dashboard.js";
import RootLayout from "../RootLayout.jsx";

export const rootRoute = createRootRoute({
  component: RootLayout,
});

export const routeTree = rootRoute.addChildren([
  homePageRoute,
  authRoute,
  dashboardRoute,
  analyticsRoute,
]);
