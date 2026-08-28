import express from "express";
import {
  deleteMessage,
  getMessages,
  updateMessageReadStatus,
} from "../controllers/contactMessageController.js";
import { admin, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, admin);
router.get("/", getMessages);
router.patch("/:id/read", updateMessageReadStatus);
router.delete("/:id", deleteMessage);

export default router;
