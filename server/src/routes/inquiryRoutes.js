import { Router } from "express";
import { createInquiry, listInquiries, listMyInquiries, updateInquiryStatus } from "../controllers/inquiryController.js";
import { optionalAuth, requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();
router.post("/", optionalAuth, createInquiry);
router.get("/mine", requireAuth, listMyInquiries);
router.get("/", requireAuth, requireAdmin, listInquiries);
router.patch("/:id/status", requireAuth, requireAdmin, updateInquiryStatus);
export default router;
