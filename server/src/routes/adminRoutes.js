import { Router } from "express";
import { getStats, listClients } from "../controllers/adminController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth, requireAdmin);
router.get("/stats", getStats);
router.get("/clients", listClients);
export default router;
