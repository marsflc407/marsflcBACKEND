import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      enum: [
        "home",
        "about",
        "management",
        "family",
        "sister-concern",
        "company-overview",
        "cpv",
        "debt-collection",
        "careers",
        "contact",
      ],
      required: true,
    },
    section: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    image: { type: String, trim: true },
    buttonLabel: { type: String, trim: true },
    buttonUrl: { type: String, trim: true },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Content = mongoose.model("Content", contentSchema);

export default Content;
