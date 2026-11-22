import { Router } from "express";
import { createBooking, listAllBookings, listMyBookings, updateBookingStatus } from "../controllers/bookingController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();
router.post("/", requireAuth, createBooking);
router.get("/mine", requireAuth, listMyBookings);
router.get("/", requireAuth, requireAdmin, listAllBookings);
router.patch("/:id/status", requireAuth, requireAdmin, updateBookingStatus);
export default router;
