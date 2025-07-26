import express from "express";
import {
  getAnalytics,
  getUrlAnalytics,
} from "../controllers/analytics.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAnalytics);
router.get("/url/:urlId", authMiddleware, getUrlAnalytics);

export default router;
