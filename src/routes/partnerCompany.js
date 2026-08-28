import express from "express";
import {
  createPartnerCompany,
  deletePartnerCompany,
  getPartnerCompanies,
} from "../controllers/partnerCompanyController.js";
import { admin, protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getPartnerCompanies);
router.post("/", protect, admin, upload.single("image"), createPartnerCompany);
router.delete("/:id", protect, admin, deletePartnerCompany);

export default router;
