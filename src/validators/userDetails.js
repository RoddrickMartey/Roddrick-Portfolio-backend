import Joi from "joi";

export const userDetailsSchema = Joi.object({
  fullName: Joi.string().max(100).optional(),
  headline: Joi.string().max(140).optional(),
  bio: Joi.array().items(Joi.string().min(1)).min(1).optional(),
  homeImage: Joi.string().uri().allow(null, "").optional(),
  aboutImage: Joi.string().uri().allow(null, "").optional(),
  email: Joi.string().email().allow(null, "").optional(),
  phone: Joi.string()
    .pattern(/^[+()\-\s0-9]*$/)
    .allow(null, "")
    .optional(),
  location: Joi.string().max(140).allow(null, "").optional(),
  techStack: Joi.array().items(Joi.string().trim().min(1)).optional(),
  skills: Joi.array().items(Joi.string().trim().min(1)).optional(),
  socials: Joi.object({
    github: Joi.string().uri().allow(null, "").optional(),
    linkedin: Joi.string().uri().allow(null, "").optional(),
    twitter: Joi.string().uri().allow(null, "").optional(),
    website: Joi.string().uri().allow(null, "").optional(),
    youtube: Joi.string().uri().allow(null, "").optional(),
    instagram: Joi.string().uri().allow(null, "").optional(),
  }).optional(),
  availableForWork: Joi.boolean().optional(),
});
