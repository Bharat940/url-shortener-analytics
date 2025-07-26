import express from "express";
import dotenv from "dotenv";
import shortUrlRoutes from "./src/routes/shortUrl.route.js";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.route.js";
import analyticsRoutes from "./src/routes/analytics.routes.js";
import connectDB from "./src/config/mongo.config.js";
import { redirectFromShortUrl } from "./src/controllers/shortUrl.controller.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import { attachUser } from "./src/utils/attachUser.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectRedis } from "./src/config/redis.config.js";
import { anonymousRateLimiter } from "./src/middlewares/rateLimiter.middleware.js";

dotenv.config({ path: "./.env" });

const app = express();

app.set("trust proxy", true);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(attachUser);

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/create", anonymousRateLimiter, shortUrlRoutes);
app.get("/:id", redirectFromShortUrl);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  connectDB();
  connectRedis();
  console.log(`Server is running on http://localhost:${PORT}`);
});
