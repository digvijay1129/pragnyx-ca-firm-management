import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  service: { type: String, required: true, trim: true, maxlength: 120 },
  details: { type: String, required: true, trim: true, maxlength: 3000 },
  status: { type: String, enum: ["pending", "in-progress", "approved", "rejected", "completed"], default: "pending" },
  adminNote: { type: String, trim: true, maxlength: 1000, default: "" },
}, { timestamps: true });

export default mongoose.model("ServiceRequest", serviceRequestSchema);
