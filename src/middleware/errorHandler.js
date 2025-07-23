import { NODE_ENV } from "../data/secrets.js";

/**
 * Global error handling middleware
 */
export function errorHandler(err, req, res, next) {
  console.error("❌ Error:", err.stack || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
    ...(NODE_ENV === "development" && { stack: err.stack }), // Show stack in dev only
  });
}
