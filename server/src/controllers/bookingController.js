import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isNonEmptyString, isValidDateOnly, isValidEmail, isValidPhone, isValidTime24h } from "../utils/validators.js";

function indiaToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

export const createBooking = asyncHandler(async (req, res) => {
  const { name, email, phone, service, preferredDate, preferredTime, message = "" } = req.body || {};
  if (
    !isNonEmptyString(name, 100)
    || !isValidEmail(email)
    || !isValidPhone(phone)
    || !isNonEmptyString(service, 120)
    || !isValidDateOnly(preferredDate)
    || !isValidTime24h(preferredTime)
    || typeof message !== "string"
    || message.length > 2000
  ) {
    throw new HttpError(400, "Enter valid contact details, a service, a real calendar date, a preferred time and a message of at most 2,000 characters.");
  }
  if (preferredDate < indiaToday()) {
    throw new HttpError(400, "Choose a date that is not in the past.");
  }
  const activeService = await Service.findOne({ name: service.trim(), isActive: true });
  if (!activeService) throw new HttpError(400, "Select one of the currently available services.");
  const booking = await Booking.create({
    user: req.user._id,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    service: activeService.name,
    preferredDate: new Date(`${preferredDate}T00:00:00.000Z`),
    preferredTime,
    message: message.trim(),
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
  const { status, adminNote } = req.body || {};
  if (!["pending", "approved", "rejected", "completed"].includes(status)) {
    throw new HttpError(400, "Invalid booking status.");
  }
  if (adminNote !== undefined && (typeof adminNote !== "string" || adminNote.length > 1000)) {
    throw new HttpError(400, "Admin note must be a string of at most 1,000 characters.");
  }
  const updates = { status };
  if (adminNote !== undefined) updates.adminNote = adminNote.trim();
  const booking = await Booking.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!booking) throw new HttpError(404, "Booking not found.");
  res.json({ success: true, booking });
});
