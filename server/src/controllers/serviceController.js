import Service from "../models/Service.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isNonEmptyString } from "../utils/validators.js";

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
  const { name, slug, shortDescription, description, icon } = req.body || {};
  if (
    !isNonEmptyString(name, 120)
    || !isNonEmptyString(slug, 120)
    || !isNonEmptyString(shortDescription, 240)
    || !isNonEmptyString(description, 3000)
    || (icon !== undefined && (typeof icon !== "string" || icon.length > 80))
  ) {
    throw new HttpError(400, "Provide a valid service name, URL slug, short description and description.");
  }
  const service = await Service.create({
    name: name.trim(),
    slug: slug.trim().toLowerCase(),
    shortDescription: shortDescription.trim(),
    description: description.trim(),
    icon,
  });
  res.status(201).json({ success: true, service });
});

export const updateService = asyncHandler(async (req, res) => {
  const allowed = ["name", "slug", "shortDescription", "description", "icon", "isActive"];
  const updates = Object.fromEntries(Object.entries(req.body || {}).filter(([key]) => allowed.includes(key)));
  if (Object.keys(updates).length === 0) throw new HttpError(400, "Provide at least one supported service field to update.");

  const stringLimits = { name: 120, slug: 120, shortDescription: 240, description: 3000, icon: 80 };
  for (const [field, maxLength] of Object.entries(stringLimits)) {
    if (field in updates && typeof updates[field] !== "string") {
      throw new HttpError(400, `${field} must be a string.`);
    }
    if (field in updates && updates[field].length > maxLength) {
      throw new HttpError(400, `${field} exceeds the maximum length of ${maxLength} characters.`);
    }
    if (field in updates) updates[field] = updates[field].trim();
  }
  if ("slug" in updates) updates.slug = updates.slug.toLowerCase();
  if ("isActive" in updates && typeof updates.isActive !== "boolean") {
    throw new HttpError(400, "isActive must be true or false.");
  }

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
