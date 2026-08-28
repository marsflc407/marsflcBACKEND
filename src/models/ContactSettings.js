import mongoose from "mongoose";

const contactSettingsSchema = new mongoose.Schema(
  {
    heroLabel: { type: String, trim: true, default: "Contact Us" },
    heroTitle: { type: String, trim: true, default: "Engage MARS FLC" },
    heroIntro: { type: String, trim: true },
    informationTitle: { type: String, trim: true, default: "Direct Lines" },
    informationLabel: {
      type: String,
      trim: true,
      default: "Contact Information",
    },
    addressLabel: { type: String, trim: true, default: "Address" },
    address: { type: String, trim: true },
    phoneLabel: { type: String, trim: true, default: "Hotline" },
    phone: { type: String, trim: true },
    emailLabel: { type: String, trim: true, default: "General Enquiries" },
    email: { type: String, trim: true },
    callCenterTitle: { type: String, trim: true },
    callCenterDescription: { type: String, trim: true },
    infrastructureLabel: {
      type: String,
      trim: true,
      default: "Call Center Infrastructure",
    },
    infrastructureTitle: {
      type: String,
      trim: true,
      default: "Always Within Reach",
    },
    infrastructureIntro: { type: String, trim: true },
    infrastructureItems: [
      {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
      },
    ],
    digitalLabel: { type: String, trim: true, default: "Digital Connectivity" },
    digitalTitle: { type: String, trim: true },
    digitalIntro: { type: String, trim: true },
    digitalItems: [
      {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
      },
    ],
    formLabel: { type: String, trim: true, default: "Contact Form" },
    formTitle: { type: String, trim: true, default: "Send a Message" },
    nameLabel: { type: String, trim: true, default: "Name" },
    contactLabel: { type: String, trim: true, default: "Contact Number" },
    messageLabel: { type: String, trim: true, default: "Message" },
    submitLabel: { type: String, trim: true, default: "Submit Message" },
    sendingLabel: { type: String, trim: true, default: "Sending..." },
    anotherMessageLabel: {
      type: String,
      trim: true,
      default: "Send Another Message",
    },
    submittedTitle: { type: String, trim: true, default: "Message Received" },
    submittedMessage: { type: String, trim: true },
  },
  { timestamps: true },
);

const ContactSettings = mongoose.model(
  "ContactSettings",
  contactSettingsSchema,
);

export default ContactSettings;
