import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new HttpError(401, "Please sign in to continue.");
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new HttpError(401, "Your session is invalid or has expired. Please sign in again.");
  }
  const user = await User.findById(payload.sub).select("-password");
  if (!user || !user.isActive) throw new HttpError(401, "This account is unavailable.");
  req.user = user;
  next();
});

export const requireAdmin = (req, _res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new HttpError(403, "Administrator access is required."));
  }
  next();
};
