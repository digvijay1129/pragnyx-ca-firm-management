import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ },
  shortDescription: { type: String, required: true, trim: true, maxlength: 240 },
  description: { type: String, required: true, trim: true, maxlength: 3000 },
  icon: { type: String, default: "briefcase" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

serviceSchema.index({ isActive: 1, name: 1 });
export default mongoose.model("Service", serviceSchema);
