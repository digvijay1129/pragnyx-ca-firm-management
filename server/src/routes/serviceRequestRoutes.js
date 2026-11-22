import { Router } from "express";
import { createServiceRequest, listAllServiceRequests, listMyServiceRequests, updateServiceRequestStatus } from "../controllers/serviceRequestController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();
router.post("/", requireAuth, createServiceRequest);
router.get("/mine", requireAuth, listMyServiceRequests);
router.get("/", requireAuth, requireAdmin, listAllServiceRequests);
router.patch("/:id/status", requireAuth, requireAdmin, updateServiceRequestStatus);
export default router;
