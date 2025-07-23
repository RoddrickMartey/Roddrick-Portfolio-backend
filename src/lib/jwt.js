import jwt from "jsonwebtoken";
import { JWT_EXPIRES, JWT_SECRET, NODE_ENV } from "../data/secrets.js";
/**
 * Generate a JWT token
 */
export function signToken(payload, expiresIn = JWT_EXPIRES) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Set JWT token as HTTP-only cookie for 4 hours
 */
export function setTokenCookie(res, payload) {
  const token = signToken(payload);
  res.cookie("token", token, {
    httpOnly: true,
    secure: NODE_ENV === "production", // Only send over HTTPS
    sameSite: NODE_ENV === "production" ? "None" : "Lax", // "None" for cross-site
    maxAge: 4 * 60 * 60 * 1000, // 4 hours
  });
}

/**
 * Middleware to check token in cookies
 */
export function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
