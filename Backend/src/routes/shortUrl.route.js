import express from "express";
import { createShortUrl } from "../controllers/shortUrl.controller.js";
import { attachUser } from "../utils/attachUser.js";

const router = express.Router();

router.post("/", attachUser, createShortUrl);

export default router;
