import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    vacancy: {
      type: Number,
      required: true,
      default: 1,
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      trim: true,
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

const Career = mongoose.model("Career", careerSchema);

export default Career;
