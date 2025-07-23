import Joi from "joi";
import mongoose from "mongoose";

const isObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const createProjectSchema = Joi.object({
  title: Joi.string().max(140).required(),

  summary: Joi.string().max(300).required(),

  description: Joi.array().items(Joi.string().min(1)).optional(),
  contentHtml: Joi.string().allow(null, "").optional(),

  tech: Joi.array()
    .items(Joi.string().custom(isObjectId, "objectId"))
    .optional(),
  extraTech: Joi.array().items(Joi.string().trim().min(1)).optional(),

  tags: Joi.array().items(Joi.string().trim().min(1)).optional(),

  image: Joi.string().uri().allow(null, "").optional(),
  gallery: Joi.array().items(Joi.string().uri()).optional(),

  repoUrl: Joi.string().uri().allow(null, "").optional(),
  liveUrl: Joi.string().uri().allow(null, "").optional(),

  featured: Joi.boolean().optional(),

  status: Joi.string().valid("draft", "published").optional(),
});

export const updateProjectSchema = Joi.object({
  title: Joi.string().max(140).optional(),

  summary: Joi.string().max(300).optional(),

  description: Joi.array().items(Joi.string().min(1)).optional(),
  contentHtml: Joi.string().allow(null, "").optional(),

  tech: Joi.array()
    .items(Joi.string().custom(isObjectId, "objectId"))
    .optional(),
  extraTech: Joi.array().items(Joi.string().trim().min(1)).optional(),

  tags: Joi.array().items(Joi.string().trim().min(1)).optional(),

  image: Joi.string().uri().allow(null, "").optional(),
  gallery: Joi.array().items(Joi.string().uri()).optional(),

  repoUrl: Joi.string().uri().allow(null, "").optional(),
  liveUrl: Joi.string().uri().allow(null, "").optional(),

  featured: Joi.boolean().optional(),

  status: Joi.string().valid("draft", "published").optional(),
});
