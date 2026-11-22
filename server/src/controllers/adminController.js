import User from "../models/User.js";
import Inquiry from "../models/Inquiry.js";
import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import ServiceRequest from "../models/ServiceRequest.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getStats = asyncHandler(async (_req, res) => {
  const [clients, inquiries, bookings, services, serviceRequests] = await Promise.all([
    User.countDocuments({ role: "client", isActive: true }),
    Inquiry.countDocuments(),
    Booking.countDocuments(),
    Service.countDocuments({ isActive: true }),
    ServiceRequest.countDocuments(),
  ]);
  res.json({ success: true, stats: { clients, inquiries, bookings, services, serviceRequests } });
});

export const listClients = asyncHandler(async (_req, res) => {
  const clients = await User.find({ role: "client" }).select("name email phone createdAt isActive").sort({ createdAt: -1 }).limit(500);
  res.json({ success: true, clients });
});
