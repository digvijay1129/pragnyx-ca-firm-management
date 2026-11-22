import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    maxlength: 180,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
    match: /^\+?[0-9][0-9\s().-]{6,28}$/,
  },
  subject: { type: String, required: true, trim: true, maxlength: 160 },
  message: { type: String, required: true, trim: true, maxlength: 4000 },
  status: { type: String, enum: ["new", "in-progress", "resolved"], default: "new" },
}, { timestamps: true });

inquirySchema.index({ status: 1, createdAt: -1 });
export default mongoose.model("Inquiry", inquirySchema);
