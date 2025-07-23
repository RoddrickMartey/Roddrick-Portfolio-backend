import express from "express";
import {
  getUserDetails,
  upsertUserDetails,
  patchUserDetails,
} from "../controllers/userDetails.controller.js";
import { userDetailsSchema } from "../validators/userDetails.js";
import { validate } from "../middleware/validate.js";
import { authMiddleware } from "../lib/jwt.js";

const router = express.Router();

// Public (frontend reads)
router.get("/", getUserDetails);

// Auth-protected update
router.put("/", authMiddleware, validate(userDetailsSchema), upsertUserDetails);

// Partial merge
router.patch(
  "/",
  authMiddleware,
  validate(userDetailsSchema),
  patchUserDetails
);

export default router;
