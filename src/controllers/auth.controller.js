import { setTokenCookie } from "../lib/jwt.js";
import { sanitize } from "../lib/sanitize.js";
import User from "../models/User.js";
import { NODE_ENV } from "../data/secrets.js";

export const signup = async (req, res, next) => {
  try {
    const cleaned = sanitize(req.body);
    const { username, password, resetPasswordSecret } = cleaned;

    if (
      username === password ||
      username === resetPasswordSecret ||
      password === resetPasswordSecret
    ) {
      return res.status(400).json({
        message: "Reset secret cannot match username or password.",
      });
    }

    const user = await User.create({ username, password, resetPasswordSecret });
    return res
      .status(201)
      .json({ message: "Signup successful", username: user.username });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Username already exists" });
    }
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const cleaned = sanitize(req.body);
    const { username, password } = cleaned;

    const user = await User.findOne({ username }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    setTokenCookie(res, { id: user._id, username: user.username });

    return res
      .status(200)
      .json({ message: "Login successful", username: user.username });
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const cleaned = sanitize(req.body);
    const { username, resetSecret, newPassword } = cleaned;

    // Need both hashed fields
    const user = await User.findOne({ username }).select(
      "+password +resetPasswordSecret"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify reset secret
    const ok = await user.verifyResetSecret(resetSecret);
    if (!ok) return res.status(403).json({ message: "Invalid reset secret" });

    // Change password (will hash in pre-save)
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated" });
  } catch (err) {
    next(err);
  }
};

export const updateUsername = async (req, res, next) => {
  try {
    const cleaned = sanitize(req.body);
    const { username, resetSecret, newUsername } = cleaned;

    const user = await User.findOne({ username }).select(
      "+resetPasswordSecret"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await user.verifyResetSecret(resetSecret);
    if (!ok) return res.status(403).json({ message: "Invalid reset secret" });

    user.username = newUsername;
    await user.save();

    return res
      .status(200)
      .json({ message: "Username updated", username: user.username });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Username already exists" });
    }
    next(err);
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};
