import Joi from "joi";

export const signupSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .message("Password must include upper, lower, number, and special char.")
    .required(),
  resetPasswordSecret: Joi.string().min(4).max(128).required(),
});

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const updatePasswordSchema = Joi.object({
  username: Joi.string().required(),
  resetSecret: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .max(64)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .message(
      "New password must include upper, lower, number, and special char."
    )
    .required(),
});

export const updateUsernameSchema = Joi.object({
  username: Joi.string().required(), // current username
  resetSecret: Joi.string().required(),
  newUsername: Joi.string().alphanum().min(3).max(50).required(),
});
