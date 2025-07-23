import express from "express";
import fs from "node:fs";
import path from "node:path";
import { parseMorganCombined } from "../utils/parseMorganCombined.js";
import { authMiddleware } from "../lib/jwt.js";

const router = express.Router();

// Adjust if logs dir is elsewhere:
const LOG_DIR = path.join(process.cwd(), "logs");

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : null;

    if (!fs.existsSync(LOG_DIR)) {
      return res.json({ data: [], count: 0 });
    }

    // get log files
    const files = fs
      .readdirSync(LOG_DIR)
      .filter((f) => f.startsWith("access-") && f.endsWith(".log"))
      .sort() // ascending
      .reverse(); // newest first

    const entries = [];

    for (const filename of files) {
      const filePath = path.join(LOG_DIR, filename);
      const raw = fs.readFileSync(filePath, "utf8");
      const lines = raw.split(/\r?\n/).filter(Boolean);

      // newest lines last in file; we want chronological? We'll push in file order.
      for (const line of lines) {
        const parsed = parseMorganCombined(line);
        if (parsed) {
          // include filename info
          parsed._file = filename;
          entries.push(parsed);
        }
      }

      if (limit && entries.length >= limit) break;
    }

    const sliced = limit ? entries.slice(-limit) : entries; // return last N (most recent)
    return res.json({ data: sliced, count: sliced.length });
  } catch (err) {
    next(err);
  }
});

export default router;
