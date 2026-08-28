import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    icon: { type: String, trim: true },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { _id: true },
);

const debtCollectionSettingsSchema = new mongoose.Schema(
  {
    heroLabel: String,
    heroTitle: String,
    heroIntro: String,
    heroImages: [{ type: String, trim: true }],
    servicesLabel: String,
    servicesTitle: String,
    servicesIntro: String,
    services: [itemSchema],
    specializedLabel: String,
    specializedTitle: String,
    specializedIntro: String,
    specialized: [itemSchema],
    advantagesLabel: String,
    advantagesTitle: String,
    advantagesIntro: String,
    advantages: [itemSchema],
    infrastructureLabel: String,
    infrastructureTitle: String,
    infrastructure: [itemSchema],
    buttonLabel: String,
    buttonUrl: String,
  },
  { timestamps: true },
);

const DebtCollectionSettings = mongoose.model(
  "DebtCollectionSettings",
  debtCollectionSettingsSchema,
);

export default DebtCollectionSettings;
