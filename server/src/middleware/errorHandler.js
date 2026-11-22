export function notFound(_req, res) {
  res.status(404).json({ success: false, message: "The requested endpoint was not found." });
}

export function errorHandler(error, _req, res, next) {
  if (res.headersSent) return next(error);

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
  if (error?.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Request body must contain valid JSON." });
  }
  if (error?.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Request body exceeds the 1 MB limit." });
  }

  const status = Number(error?.statusCode || error?.status) || 500;
  if (status >= 500) console.error(error);
  const message = status >= 500
    ? "An unexpected server error occurred."
    : (error.message || "The request could not be processed.");
  res.status(status).json({ success: false, message });
}
