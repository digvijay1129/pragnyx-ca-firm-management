import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 180 },
  phone: { type: String, trim: true, maxlength: 30, default: "" },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ["client", "admin"], default: "client", immutable: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
