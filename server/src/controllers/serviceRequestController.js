import ServiceRequest from "../models/ServiceRequest.js";
import Service from "../models/Service.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isNonEmptyString } from "../utils/validators.js";

export const createServiceRequest = asyncHandler(async (req, res) => {
  const { service, details } = req.body || {};
  if (!isNonEmptyString(service, 120) || !isNonEmptyString(details, 3000)) {
    throw new HttpError(400, "Provide a valid service and request details (up to 3,000 characters).");
  }
  const activeService = await Service.findOne({ name: service.trim(), isActive: true });
  if (!activeService) throw new HttpError(400, "Select one of the currently available services.");
  const request = await ServiceRequest.create({
    user: req.user._id,
    service: activeService.name,
    details: details.trim(),
  });
  res.status(201).json({ success: true, request });
});

export const listMyServiceRequests = asyncHandler(async (req, res) => {
  const requests = await ServiceRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, requests });
});

export const listAllServiceRequests = asyncHandler(async (_req, res) => {
  const requests = await ServiceRequest.find().populate("user", "name email").sort({ createdAt: -1 }).limit(500);
  res.json({ success: true, requests });
});

export const updateServiceRequestStatus = asyncHandler(async (req, res) => {
  const { status, adminNote } = req.body || {};
  if (!["pending", "in-progress", "approved", "rejected", "completed"].includes(status)) {
    throw new HttpError(400, "Invalid service request status.");
  }
  if (adminNote !== undefined && (typeof adminNote !== "string" || adminNote.length > 1000)) {
    throw new HttpError(400, "Admin note must be a string of at most 1,000 characters.");
  }
  const updates = { status };
  if (adminNote !== undefined) updates.adminNote = adminNote.trim();
  const request = await ServiceRequest.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!request) throw new HttpError(404, "Service request not found.");
  res.json({ success: true, request });
});
