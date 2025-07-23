import Project from "../models/Project.js";
import { sanitize } from "../lib/sanitize.js";

export function slugify(str = "") {
  return str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 140);
}

async function ensureUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 1;
  while (await Project.exists({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }
  return slug;
}

/**
 * Utility: normalize gallery/extra arrays to unique trimmed strings
 */
function uniqStrings(arr) {
  if (!Array.isArray(arr)) return [];
  return [...new Set(arr.map((s) => String(s).trim()).filter(Boolean))];
}

/**
 * POST /api/projects
 * Create project
 */
export async function createProject(req, res, next) {
  try {
    const cleaned = sanitize(req.body);

    if (!cleaned.slug && cleaned.title) {
      const base = slugify(cleaned.title);
      cleaned.slug = await ensureUniqueSlug(base);
    }

    if (cleaned.extraTech) cleaned.extraTech = uniqStrings(cleaned.extraTech);

    if (cleaned.gallery) cleaned.gallery = uniqStrings(cleaned.gallery);

    const doc = await Project.create(cleaned);
    return res.status(201).json({ message: "Project created", project: doc });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Duplicate slug or title" });
    }
    next(err);
  }
}

/**
 * GET /api/projects
 * Public: list published projects (filter + sort)
 * Query params:
 *   status=draft|published (default: published)
 *   featured=true
 */
export async function listProjects(req, res, next) {
  try {
    const { status = "published", featured } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (featured === "true") filter.featured = true;

    const docs = await Project.find(filter)
      .sort({ sortOrder: 1, createdAt: -1 })
      .populate("tech", "name slug icon color category");

    return res.json({ projects: docs });
  } catch (err) {
    next(err);
  }
}

export async function listAllProjects(req, res, next) {
  try {
    const docs = await Project.find({})
      .sort({ sortOrder: 1, createdAt: -1 })
      .populate("tech", "name slug icon color category");
    return res.json({ projects: docs, total: docs.length });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/projects/:slug
 * Public: fetch project by slug
 */
export async function getProjectBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const doc = await Project.findOne({ slug }).populate(
      "tech",
      "name slug icon color category"
    );

    if (!doc) return res.status(404).json({ message: "Project not found" });
    return res.json(doc);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/projects/:id
 * Full replace (fields optional but we treat as overwrite)
 */
export async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    const cleaned = sanitize(req.body);

    if (cleaned.extraTech) cleaned.extraTech = uniqStrings(cleaned.extraTech);

    if (cleaned.gallery) cleaned.gallery = uniqStrings(cleaned.gallery);

    const doc = await Project.findByIdAndUpdate(id, cleaned, {
      new: true,
      runValidators: true,
    }).populate("tech", "name slug icon color category");

    if (!doc) return res.status(404).json({ message: "Project not found" });
    return res.json({ message: "Project updated", project: doc });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Duplicate slug or title" });
    }
    next(err);
  }
}

/**
 * PATCH /api/projects/:id
 * Partial merge:
 *   - Strings replaced if present
 *   - Arrays merged uniquely (extraTech, tags, gallery)
 */
export async function patchProject(req, res, next) {
  try {
    const { id } = req.params;
    const cleaned = sanitize(req.body);

    let doc = await Project.findById(id).select(
      "+title +slug +summary +description +contentHtml +extraTech +tags +gallery +tech +image +repoUrl +liveUrl +featured +sortOrder +status"
    );
    if (!doc) return res.status(404).json({ message: "Project not found" });

    // Assign simple fields if present
    [
      "title",
      "slug",
      "summary",
      "contentHtml",
      "image",
      "repoUrl",
      "liveUrl",
      "featured",
      "sortOrder",
      "status",
    ].forEach((field) => {
      if (cleaned[field] !== undefined) doc[field] = cleaned[field];
    });

    // description replace
    if (cleaned.description !== undefined)
      doc.description = cleaned.description;

    // tech (replace references)
    if (cleaned.tech !== undefined) doc.tech = cleaned.tech;

    // Merge arrays uniquely
    if (Array.isArray(cleaned.extraTech)) {
      const set = new Set([
        ...doc.extraTech,
        ...uniqStrings(cleaned.extraTech),
      ]);
      doc.extraTech = [...set];
    }

    if (Array.isArray(cleaned.gallery)) {
      const set = new Set([...doc.gallery, ...uniqStrings(cleaned.gallery)]);
      doc.gallery = [...set];
    }

    await doc.save();
    doc = await doc.populate("tech", "name slug icon color category");
    return res.json({ message: "Project patched", project: doc });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/projects/:id
 */
export async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    const doc = await Project.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: "Project not found" });
    return res.json({ message: "Project deleted" });
  } catch (err) {
    next(err);
  }
}
