import express from "express";
import {
  register,
  login,
  getMe,
  requestPasswordReset,
  verifyPasswordResetOtp,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/password-reset/request", requestPasswordReset);
router.post("/password-reset/verify", verifyPasswordResetOtp);
router.post("/password-reset/complete", resetPassword);
router.get("/me", protect, getMe);

export default router;
