import bcrypt from "bcrypt";
import { NODE_ENV } from "../data/secrets.js";

/**
 * Hash a plain text password.
 * @param {string} password - The user’s plain password.
 * @returns {Promise<string>} bcrypt hash.
 */
export async function hashPassword(password) {
  if (typeof password !== "string" || password.length === 0) {
    throw new Error("Password required for hashing.");
  }

  const saltRounds = NODE_ENV === "production" ? 12 : 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare a plain password to a stored hash.
 * @param {string} password - Plain input.
 * @param {string} hash - Stored bcrypt hash.
 * @returns {Promise<boolean>} match?
 */
export async function comparePassword(password, hash) {
  if (!hash) return false;
  return await bcrypt.compare(password, hash);
}
