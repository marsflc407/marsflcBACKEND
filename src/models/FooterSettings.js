import mongoose from "mongoose";

const footerSettingsSchema = new mongoose.Schema(
  {
    brandName: { type: String, trim: true },
    description: { type: String, trim: true },
    quickLinks: [
      {
        label: { type: String, trim: true },
        to: { type: String, trim: true },
      },
    ],
    officeTitle: { type: String, trim: true },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    phoneHref: { type: String, trim: true },
    email: { type: String, trim: true },
    hoursTitle: { type: String, trim: true },
    hours: [
      {
        title: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],
    socialLinks: [
      {
        platform: { type: String, trim: true },
        url: { type: String, trim: true },
      },
    ],
    website: { type: String, trim: true },
    websiteHref: { type: String, trim: true },
    copyrightText: { type: String, trim: true },
  },
  { timestamps: true },
);

const FooterSettings = mongoose.model("FooterSettings", footerSettingsSchema);

export default FooterSettings;
