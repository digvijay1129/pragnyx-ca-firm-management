export function isNonEmptyString(value, maxLength) {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength;
}

export function isValidEmail(value) {
  return typeof value === "string"
    && value.length <= 180
    && /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value.trim());
}

export function isValidPhone(value) {
  return typeof value === "string"
    && value.trim().length <= 30
    && /^\\+?[0-9][0-9\\s().-]{6,28}$/.test(value.trim());
}

export function isValidDateOnly(value) {
  if (typeof value !== "string" || !/^\\d{4}-\\d{2}-\\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function isValidTime24h(value) {
  return typeof value === "string" && /^([01]\\d|2[0-3]):[0-5]\\d$/.test(value);
}
