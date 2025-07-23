import mongoose from "mongoose";
import { hashPassword } from "../lib/password.js"; // hashes (bcrypt)

/**
 * NOTE:
 * We'll reuse the same bcrypt helpers for reset secret.
 * You can optionally create separate hash/compare funcs if you want different salt rounds.
 */

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    // Hashed password (bcrypt)
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // hidden unless explicitly selected
    },

    // Hashed reset secret (bcrypt) -- REQUIRED for protected updates
    resetPasswordSecret: {
      type: String,
      select: false,
      default: null,
    },
  },
  { timestamps: true }
);

/* --------------------
 * PRE-SAVE: hash password if modified
 * -------------------- */
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await hashPassword(this.password);
    }
    if (this.isModified("resetPasswordSecret") && this.resetPasswordSecret) {
      this.resetPasswordSecret = await hashPassword(this.resetPasswordSecret);
    }
    next();
  } catch (err) {
    next(err);
  }
});

/* --------------------
 * comparePassword(candidate)
 * -------------------- */
userSchema.methods.comparePassword = async function (candidate) {
  const { comparePassword } = await import("../lib/password.js");
  return comparePassword(candidate, this.password);
};

/* --------------------
 * setResetSecret(secretPlain)
 * Will hash on save.
 * -------------------- */
userSchema.methods.setResetSecret = function (secretPlain) {
  this.resetPasswordSecret = secretPlain;
};

/* --------------------
 * verifyResetSecret(inputPlain)
 * -------------------- */
userSchema.methods.verifyResetSecret = async function (inputPlain) {
  if (!this.resetPasswordSecret) return false;
  const { comparePassword } = await import("../lib/password.js");
  return comparePassword(inputPlain, this.resetPasswordSecret);
};

const User = mongoose.model("User", userSchema);
export default User;
