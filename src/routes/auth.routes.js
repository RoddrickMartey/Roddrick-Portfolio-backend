import express from "express";
import {
  signup,
  login,
  logout,
  updatePassword,
  updateUsername,
} from "../controllers/auth.controller.js";
import {
  signupSchema,
  loginSchema,
  updatePasswordSchema,
  updateUsernameSchema,
} from "../validators/auth.js";
import { validate } from "../middleware/validate.js";
import { authMiddleware } from "../lib/jwt.js"; // if you want auth-protected logout
import rateLimit from "express-rate-limit";

// Apply to all auth routes (login, signup, logout, etc.)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 requests per 15 mins
  message: "Too many authentication attempts. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();

router.use(authLimiter);

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

router.use(authMiddleware);

router.put("/password", validate(updatePasswordSchema), updatePassword);
router.put("/username", validate(updateUsernameSchema), updateUsername);

export default router;
