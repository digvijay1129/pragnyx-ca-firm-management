import { Router } from "express";
import { createInquiry, listInquiries, updateInquiryStatus } from "../controllers/inquiryController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();
router.post("/", createInquiry);
router.get("/", requireAuth, requireAdmin, listInquiries);
router.patch("/:id/status", requireAuth, requireAdmin, updateInquiryStatus);
export default router;
