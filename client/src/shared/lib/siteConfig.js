const configuredEmail = import.meta.env.VITE_FIRM_EMAIL;
const configuredPhone = import.meta.env.VITE_FIRM_PHONE;
const configuredLocation = import.meta.env.VITE_FIRM_LOCATION;

// Keep demo disclosure enabled unless explicitly switched off AND real public
// contact details have been supplied by the business owner.
const requestedDemoMode = import.meta.env.VITE_DEMO_MODE !== "false";
const hasConfiguredContact = Boolean(configuredEmail && configuredPhone && configuredLocation);
const isDemo = requestedDemoMode || !hasConfiguredContact;

export const siteBrand = {
  name: "PragnyX",
  descriptor: "ACCOUNTANCY & ADVISORY",
  tagline: "Clarity in every number. Confidence in every decision.",
  isDemo,
  demoLabel: "DEMO PROJECT",
  demoNotice: "PragnyX is a fictional assignment brand. It is not a real CA firm or professional office.",
};

const email = configuredEmail || "hello@pragnyx.example";
const phone = configuredPhone || "+91 00000 00000";

export const firmContact = {
  email,
  phone,
  phoneHref: phone.replace(/[^0-9+]/g, ""),
  hours: import.meta.env.VITE_FIRM_HOURS || "Monday-Friday, 9:30 AM-6:30 PM (sample hours)",
  location: configuredLocation || "Demo location — India (no physical office)",
  isDemo,
  demoContactNotice: "Sample contact details only. This demonstration is not connected to a real CA office.",
  demoFormNotice: "Demo only: submissions are stored in the assignment database and are not sent to a real firm.",
};
