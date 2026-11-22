const email = import.meta.env.VITE_FIRM_EMAIL || "hello@pragnyx.example";
const phone = import.meta.env.VITE_FIRM_PHONE || "+91 00000 00000";

export const firmContact = {
  email,
  phone,
  phoneHref: phone.replace(/[^0-9+]/g, ""),
  hours: import.meta.env.VITE_FIRM_HOURS || "Monday-Friday, 9:30 AM-6:30 PM",
  location: import.meta.env.VITE_FIRM_LOCATION || "India - By appointment",
};
