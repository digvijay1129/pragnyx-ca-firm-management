import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function signToken(user) {
  if (!process.env.JWT_SECRET) throw new HttpError(500, "Authentication is not configured.");
  return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role };
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone = "" } = req.body;
  if (!name?.trim() || !email?.trim() || !password) throw new HttpError(400, "Name, email and password are required.");
  if (password.length < 8) throw new HttpError(400, "Password must contain at least 8 characters.");
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) throw new HttpError(400, "Enter a valid email address.");
  const user = await User.create({ name: name.trim(), email: normalizedEmail, password, phone });
  res.status(201).json({ success: true, token: signToken(user), user: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new HttpError(400, "Email and password are required.");
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
  if (!user || !user.isActive || !(await user.comparePassword(password))) {
    throw new HttpError(401, "Email or password is incorrect.");
  }
  res.json({ success: true, token: signToken(user), user: publicUser(user) });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: publicUser(req.user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  if (name !== undefined) {
    if (!name.trim()) throw new HttpError(400, "Name cannot be empty.");
    req.user.name = name.trim();
  }
  if (phone !== undefined) req.user.phone = phone.trim();
  await req.user.save();
  res.json({ success: true, user: publicUser(req.user) });
});
