import mongoose from "mongoose";

const heroSlideSchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      trim: true,
      default: "Mars Financial & Legal Consultancy",
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const HeroSlide = mongoose.model("HeroSlide", heroSlideSchema);

export default HeroSlide;
