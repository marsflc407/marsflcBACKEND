import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import PasswordResetChallenge from "../models/PasswordResetChallenge.js";
import { sendPasswordResetOtp } from "../utils/email.js";

const hashValue = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const userData = await User.findById(user._id).select("-password");
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      data: {
        user: userData,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide an email address" });
    }

    const user = await User.findOne({ email, role: "admin" });
    if (user) {
      const otp = crypto.randomInt(100000, 1000000).toString();
      await PasswordResetChallenge.deleteMany({ email });
      await PasswordResetChallenge.create({
        email,
        otpHash: hashValue(otp),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });
      await sendPasswordResetOtp({ to: email, otp });
    }

    return res.status(200).json({
      success: true,
      message: "If an admin account exists, a verification code has been sent.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPasswordResetOtp = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const otp = req.body.otp?.trim();
    const challenge = await PasswordResetChallenge.findOne({
      email,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    const invalid =
      !challenge ||
      challenge.verified ||
      !/^\d{6}$/.test(otp || "") ||
      challenge.attempts >= 5 ||
      hashValue(otp || "") !== challenge.otpHash;

    if (invalid) {
      if (challenge && !challenge.verified) {
        await PasswordResetChallenge.updateOne(
          { _id: challenge._id },
          { $inc: { attempts: 1 } },
        );
      }
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid or expired verification code",
        });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    challenge.verified = true;
    challenge.resetTokenHash = hashValue(resetToken);
    await challenge.save();
    return res.status(200).json({ success: true, resetToken });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { resetToken, password } = req.body;
    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 8 characters",
        });
    }

    const challenge = await PasswordResetChallenge.findOne({
      email,
      verified: true,
      resetTokenHash: hashValue(resetToken || ""),
      expiresAt: { $gt: new Date() },
    });
    const user = challenge
      ? await User.findOne({ email, role: "admin" }).select("+password")
      : null;
    if (!challenge || !user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid or expired password reset session",
        });
    }

    user.password = password;
    await user.save();
    await PasswordResetChallenge.deleteMany({ email });
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    return res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
