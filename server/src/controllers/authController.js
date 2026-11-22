import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isNonEmptyString, isValidEmail, isValidPhone } from "../utils/validators.js";

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
  const { name, email, password, phone = "" } = req.body || {};
  if (!isNonEmptyString(name, 100) || !isValidEmail(email) || typeof password !== "string") {
    throw new HttpError(400, "Enter a valid name and email address, and provide a password.");
  }
  if (password.length < 8) throw new HttpError(400, "Password must contain at least 8 characters.");
  if (Buffer.byteLength(password, "utf8") > 72) {
    throw new HttpError(400, "Password must be no longer than 72 UTF-8 bytes.");
  }
  if (typeof phone !== "string" || (phone !== "" && !isValidPhone(phone))) throw new HttpError(400, "Enter a valid phone number.");

  if (!process.env.JWT_SECRET) throw new HttpError(500, "Authentication is not configured. Contact the administrator.");

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    phone: phone.trim(),
  });
  res.status(201).json({ success: true, token: signToken(user), user: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!isValidEmail(email) || typeof password !== "string" || password.length === 0 || Buffer.byteLength(password, "utf8") > 72) {
    throw new HttpError(400, "Enter a valid email address and a password of no more than 72 UTF-8 bytes.");
  }
  if (!process.env.JWT_SECRET) throw new HttpError(500, "Authentication is not configured. Contact the administrator.");
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
  const { name, phone } = req.body || {};
  if (name === undefined && phone === undefined) {
    throw new HttpError(400, "Provide a name or phone number to update.");
  }
  if (name !== undefined) {
    if (!isNonEmptyString(name, 100)) throw new HttpError(400, "Name must contain 1 to 100 characters.");
    req.user.name = name.trim();
  }
  if (phone !== undefined) {
    if (phone !== "" && !isValidPhone(phone)) throw new HttpError(400, "Enter a valid phone number.");
    req.user.phone = phone.trim();
  }
  await req.user.save();
  res.json({ success: true, user: publicUser(req.user) });
});
