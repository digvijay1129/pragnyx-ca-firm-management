import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    maxlength: 180,
    match: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
    match: /^\\+?[0-9][0-9\\s().-]{6,28}$/,
  },
  service: { type: String, required: true, trim: true, maxlength: 120 },
  preferredDate: { type: Date, required: true },
  preferredTime: { type: String, required: true, match: /^([01]\\d|2[0-3]):[0-5]\\d$/ },
  message: { type: String, trim: true, maxlength: 2000, default: "" },
  status: { type: String, enum: ["pending", "approved", "rejected", "completed"], default: "pending" },
  adminNote: { type: String, trim: true, maxlength: 1000, default: "" },
}, { timestamps: true });

bookingSchema.index({ preferredDate: 1, preferredTime: 1, status: 1 });
bookingSchema.index({ createdAt: -1 });
export default mongoose.model("Booking", bookingSchema);
