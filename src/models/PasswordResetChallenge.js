import mongoose from "mongoose";

const passwordResetChallengeSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    otpHash: { type: String, required: true },
    resetTokenHash: { type: String },
    attempts: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true, expires: 0 },
  },
  { timestamps: true },
);

export default mongoose.model(
  "PasswordResetChallenge",
  passwordResetChallengeSchema,
);
