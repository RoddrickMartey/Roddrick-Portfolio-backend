/**
 * scripts/seedTech.js
 *
 * Seed a master Tech list into MongoDB so you can attach tech IDs
 * to Projects without retyping names.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Tech from "../src/models/Tech.js"; // make sure this path is correct

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to JSON data
const techJsonPath = path.join(__dirname, "techs.json");

// Load JSON
const techs = JSON.parse(fs.readFileSync(techJsonPath, "utf8"));

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB.");

    for (const t of techs) {
      const { slug, ...rest } = t;
      await Tech.findOneAndUpdate(
        { slug },
        { slug, ...rest },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`  • Upserted: ${slug}`);
    }

    console.log("✅ Tech seeding complete.");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected.");
  }
}

seed();
