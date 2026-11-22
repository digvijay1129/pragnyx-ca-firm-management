import { Router } from "express";
import { createService, deleteService, getService, listServices, updateService } from "../controllers/serviceController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();
router.get("/", listServices);
router.get("/:slug", getService);
router.post("/", requireAuth, requireAdmin, createService);
router.patch("/:id", requireAuth, requireAdmin, updateService);
router.delete("/:id", requireAuth, requireAdmin, deleteService);
export default router;
