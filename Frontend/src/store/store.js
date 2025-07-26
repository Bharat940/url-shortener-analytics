import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import themeProvider from "./slices/themeSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeProvider,
  },
});

export default store;
