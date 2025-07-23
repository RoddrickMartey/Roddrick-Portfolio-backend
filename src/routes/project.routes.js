import express from "express";
import {
  createProject,
  listProjects,
  listAllProjects,
  getProjectBySlug,
  updateProject,
  patchProject,
  deleteProject,
} from "../controllers/project.controller.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/project.js";
import { validate } from "../middleware/validate.js";
import { authMiddleware } from "../lib/jwt.js";
import rateLimit from "express-rate-limit";
import Tech from "../models/Tech.js";

const projectWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 write requests per window
  message: {
    status: 429,
    message: "Too many changes to projects. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();

/* ---------- Public ---------- */
router.get("/", listProjects);
router.get("/tech", async (req, res, next) => {
  try {
    // Fetch all tech items. Add .sort() or .select() if you want control.
    const tech = await Tech.find({}).lean().exec();

    // Send OK + data
    res.status(200).json(tech);
  } catch (err) {
    next(err); // Pass to your error middleware
  }
});
router.get("/:slug", getProjectBySlug);

/* ---------- Admin ---------- */
router.get("/admin/all", authMiddleware, listAllProjects);

// POST /api/projects (create)
router.post(
  "/",
  authMiddleware,
  projectWriteLimiter,
  validate(createProjectSchema),
  createProject
);

// PUT /api/projects/:id (replace)
router.put(
  "/:id",
  authMiddleware,
  projectWriteLimiter,
  validate(updateProjectSchema),
  updateProject
);

// PATCH /api/projects/:id (partial merge)
router.patch(
  "/:id",
  authMiddleware,
  projectWriteLimiter,
  validate(updateProjectSchema),
  patchProject
);

// DELETE /api/projects/:id
router.delete("/:id", authMiddleware, projectWriteLimiter, deleteProject);

export default router;
