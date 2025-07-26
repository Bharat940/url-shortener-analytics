import mongoose from "mongoose";

const clickSchema = new mongoose.Schema(
  {
    url: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShortUrl",
      required: true,
      index: true,
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: false,
    },
    referer: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      default: "Unknown",
    },
    city: {
      type: String,
      default: "Unknown",
    },
    device: {
      type: String,
      enum: ["desktop", "mobile", "tablet"],
      default: "desktop",
    },
    browser: {
      type: String,
      default: "Unknown",
    },
    os: {
      type: String,
      default: "Unknown",
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      { url: 1, timestamp: -1 },
      { timestamp: -1 },
      { country: 1 },
      { device: 1 },
    ],
  }
);

const click = mongoose.model("Click", clickSchema);
export default click;
