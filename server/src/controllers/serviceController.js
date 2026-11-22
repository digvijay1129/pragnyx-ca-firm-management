import Service from "../models/Service.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listServices = asyncHandler(async (_req, res) => {
  const services = await Service.find({ isActive: true }).sort({ name: 1 });
  res.json({ success: true, services });
});

export const getService = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug, isActive: true });
  if (!service) throw new HttpError(404, "Service not found.");
  res.json({ success: true, service });
});

export const createService = asyncHandler(async (req, res) => {
  const { name, slug, shortDescription, description, icon } = req.body;
  if (!name || !slug || !shortDescription || !description) {
    throw new HttpError(400, "Name, slug, short description and description are required.");
  }
  const service = await Service.create({ name, slug, shortDescription, description, icon });
  res.status(201).json({ success: true, service });
});

export const updateService = asyncHandler(async (req, res) => {
  const allowed = ["name", "slug", "shortDescription", "description", "icon", "isActive"];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const service = await Service.findByIdAndUpdate(req.params.id, updates, {
    new: true, runValidators: true,
  });
  if (!service) throw new HttpError(404, "Service not found.");
  res.json({ success: true, service });
});

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!service) throw new HttpError(404, "Service not found.");
  res.json({ success: true, message: "Service archived." });
});
