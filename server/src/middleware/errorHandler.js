export function notFound(_req, res) {
  res.status(404).json({ success: false, message: "The requested endpoint was not found." });
}

export function errorHandler(error, _req, res, _next) {
  if (error?.code === 11000) {
    return res.status(409).json({ success: false, message: "A record with that value already exists." });
  }
  if (error?.name === "ValidationError") {
    const message = Object.values(error.errors).map((item) => item.message).join(" ");
    return res.status(400).json({ success: false, message });
  }
  if (error?.name === "CastError") {
    return res.status(400).json({ success: false, message: "The supplied record ID is invalid." });
  }
  const status = error.statusCode || 500;
  if (status >= 500) console.error(error);
  res.status(status).json({
    success: false,
    message: status >= 500 ? "An unexpected server error occurred." : error.message,
  });
}
