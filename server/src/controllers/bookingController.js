import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function indiaToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

export const createBooking = asyncHandler(async (req, res) => {
  const { name, email, phone, service, preferredDate, preferredTime, message = "" } = req.body;
  if (!name?.trim() || !email?.trim() || !phone?.trim() || !service?.trim() || !preferredDate || !preferredTime) {
    throw new HttpError(400, "Name, email, phone, service, preferred date and preferred time are required.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new HttpError(400, "Enter a valid email address.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate) || preferredDate < indiaToday()) {
    throw new HttpError(400, "Choose a valid date that is not in the past.");
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(preferredTime)) throw new HttpError(400, "Choose a valid preferred time.");
  const activeService = await Service.findOne({ name: service.trim(), isActive: true });
  if (!activeService) throw new HttpError(400, "Select one of the currently available services.");
  const booking = await Booking.create({
    user: req.user._id, name, email, phone, service,
    preferredDate: new Date(`${preferredDate}T00:00:00.000Z`), preferredTime, message,
  });
  res.status(201).json({ success: true, booking });
});

export const listMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, bookings });
});

export const listAllBookings = asyncHandler(async (_req, res) => {
  const bookings = await Booking.find().populate("user", "name email").sort({ createdAt: -1 }).limit(500);
  res.json({ success: true, bookings });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, adminNote } = req.body;
  if (!["pending", "approved", "rejected", "completed"].includes(status)) {
    throw new HttpError(400, "Invalid booking status.");
  }
  const updates = { status };
  if (adminNote !== undefined) updates.adminNote = adminNote;
  const booking = await Booking.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!booking) throw new HttpError(404, "Booking not found.");
  res.json({ success: true, booking });
});
