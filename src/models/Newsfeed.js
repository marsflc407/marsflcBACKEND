import mongoose from "mongoose";

const newsfeedSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["regular", "external"],
      default: "regular",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    imagePublicId: {
      type: String,
      trim: true,
    },
    externalUrl: {
      type: String,
      trim: true,
    },
    sourceName: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      default: "Admin",
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
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

const Newsfeed = mongoose.model("Newsfeed", newsfeedSchema);

export default Newsfeed;
