import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routing/routeTree.js";
import { Provider, useSelector } from "react-redux";
import store from "./store/store.js";
import { ConfigProvider, theme as antdTheme } from "antd";

const { defaultAlgorithm, darkAlgorithm } = antdTheme;
const queryClient = new QueryClient();
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    store,
  },
});

const ThemeInitializer = () => {
  const theme = useSelector((state) => state.theme?.mode);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return null;
};

const ThemeWrapper = ({ children }) => {
  const mode = useSelector((state) => state.theme.mode);
  return (
    <ConfigProvider
      theme={{ algorithm: mode === "dark" ? darkAlgorithm : defaultAlgorithm }}
    >
      {children}
    </ConfigProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeInitializer />
        <ThemeWrapper>
          <RouterProvider router={router} />
        </ThemeWrapper>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
