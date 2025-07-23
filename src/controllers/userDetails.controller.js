import UserDetails from "../models/UserDetails.js";
import { sanitize } from "../lib/sanitize.js";

/**
 * GET /api/user-details
 * Public: returns your profile (first doc found).
 */
export async function getUserDetails(req, res, next) {
  try {
    const doc = await UserDetails.findOne({});
    if (!doc) return res.status(404).json({ message: "Profile not found" });
    return res.json(doc);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/user-details
 * Auth required. Creates or updates the single profile doc.
 * Uses request body as full replacement (partial allowed because fields optional).
 */
export async function upsertUserDetails(req, res, next) {
  try {
    const clean = sanitize(req.body);

    // If you want to associate the logged-in user’s ID (recommended):
    // req.user is set by authMiddleware if you're using it
    const update = { ...clean };
    if (req.user?.id) update.user = req.user.id;

    const doc = await UserDetails.findOneAndUpdate(
      {}, // match first doc (singleton)
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.json({ message: "Profile saved", profile: doc });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/user-details
 * Auth required. Performs partial merge on arrays (append unique items).
 * Useful for adding tech/skills incrementally.
 */
export async function patchUserDetails(req, res, next) {
  try {
    const clean = sanitize(req.body);
    let doc = await UserDetails.findOne({});
    if (!doc) {
      // create new if none exists
      doc = await UserDetails.create({ ...clean, user: req.user?.id });
      return res.json({ message: "Profile created", profile: doc });
    }

    // Merge fields carefully
    if (clean.fullName !== undefined) doc.fullName = clean.fullName;
    if (clean.headline !== undefined) doc.headline = clean.headline;
    if (clean.bio !== undefined) doc.bio = clean.bio; // replace whole array

    if (clean.homeImage !== undefined) doc.homeImage = clean.homeImage;
    if (clean.aboutImage !== undefined) doc.aboutImage = clean.aboutImage;

    if (clean.email !== undefined) doc.email = clean.email;
    if (clean.phone !== undefined) doc.phone = clean.phone;
    if (clean.location !== undefined) doc.location = clean.location;

    // Append unique tech items if provided
    if (Array.isArray(clean.techStack)) {
      const existing = new Set(doc.techStack);
      clean.techStack.forEach((t) => existing.add(t));
      doc.techStack = [...existing];
    }

    // Append unique skills
    if (Array.isArray(clean.skills)) {
      const existing = new Set(doc.skills);
      clean.skills.forEach((s) => existing.add(s));
      doc.skills = [...existing];
    }

    // Merge socials shallow
    if (clean.socials && typeof clean.socials === "object") {
      doc.socials = {
        ...(doc.socials.toObject?.() ?? doc.socials),
        ...clean.socials,
      };
    }

    if (clean.availableForWork !== undefined) {
      doc.availableForWork = clean.availableForWork;
    }

    await doc.save();
    return res.json({ message: "Profile updated", profile: doc });
  } catch (err) {
    next(err);
  }
}
