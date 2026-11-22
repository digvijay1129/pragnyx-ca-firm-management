import Inquiry from "../models/Inquiry.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createInquiry = asyncHandler(async (req, res) => {
  const { name, email, phone = "", subject, message } = req.body;
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    throw new HttpError(400, "Name, email, subject and message are required.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new HttpError(400, "Enter a valid email address.");
  const inquiry = await Inquiry.create({
    user: req.user?._id || null, name, email, phone, subject, message,
  });
  res.status(201).json({ success: true, inquiry });
});

export const listMyInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Inquiry.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, inquiries });
});

export const listInquiries = asyncHandler(async (_req, res) => {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(500);
  res.json({ success: true, inquiries });
});

export const updateInquiryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["new", "in-progress", "resolved"].includes(status)) throw new HttpError(400, "Invalid inquiry status.");
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
  if (!inquiry) throw new HttpError(404, "Inquiry not found.");
  res.json({ success: true, inquiry });
});
