import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDatabase } from "../config/db.js";
import User from "../models/User.js";
import Service from "../models/Service.js";

const services = [
  ["Income Tax Filing","income-tax-filing","Accurate, timely tax returns for individuals and growing businesses.","Support with preparing and filing income tax returns, understanding tax obligations and keeping records organised."],
  ["GST Registration & Filing","gst-registration-filing","Practical GST compliance, returns and registration support.","Guidance on GST registration, periodic returns, reconciliations and compliance."],
  ["Company Registration","company-registration","Choose the right structure and start your business with confidence.","Guidance through entity selection, incorporation documentation and company setup formalities."],
  ["Accounting & Bookkeeping","accounting-bookkeeping","Reliable books and clear financial records for better decisions.","Structured accounting support, bookkeeping, reconciliations and periodic reporting."],
  ["Tax Planning & Consultancy","tax-planning-consultancy","Plan ahead with a considered view of your tax position.","Understand your tax position and evaluate compliant planning choices for your goals."],
  ["Auditing Services","auditing-services","Independent review and a disciplined approach to assurance.","Audit and assurance support focused on records, controls, evidence and clear findings."],
  ["Financial Advisory","financial-advisory","Make informed decisions with a clearer view of the numbers.","Financial analysis and practical advisory support to help evaluate business performance."],
  ["Business Compliance","business-compliance","Stay organised with recurring statutory obligations.","A structured approach to recurring statutory filings, documentation and compliance calendars."],
];

async function seed() {
  await connectDatabase();
  for (const [name,slug,shortDescription,description] of services) {
    await Service.updateOne(
      { slug },
      { $set: { name, shortDescription, description, isActive: true } },
      { upsert: true, runValidators: true }
    );
  }

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "PragnyX Administrator";
  if (email || password) {
    if (!email || !password || password.length < 12) {
      throw new Error("Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters together.");
    }
    const existing = await User.findOne({ email });
    if (existing) {
      if (existing.role !== "admin") throw new Error("ADMIN_EMAIL already belongs to a client account. Choose a different email.");
      existing.name = name;
      existing.password = await bcrypt.hash(password, 12);
      existing.isActive = true;
      await existing.save();
    } else {
      await User.create({ name, email, password, role: "admin" });
    }
    console.log(`Administrator account ready for ${email}`);
  } else {
    console.log("No administrator created. Set ADMIN_EMAIL, ADMIN_NAME and ADMIN_PASSWORD to seed one.");
  }
  console.log(`Seeded ${services.length} CA services.`);
}

seed()
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(async () => { await mongoose.disconnect(); });
