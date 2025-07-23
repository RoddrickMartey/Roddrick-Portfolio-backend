import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    summary: { type: String, required: true, maxlength: 300 },

    // Array of paragraph strings (case study text)
    description: { type: [String], default: [] },

    // Optional full HTML body if you want richer content
    contentHtml: { type: String, default: null },

    // Centralized tech references
    tech: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tech" }],

    // Extra free-form tech labels (quick overrides)
    extraTech: { type: [String], default: [] },

    tags: { type: [String], default: [] },

    image: { type: String, default: null }, // cover image
    gallery: { type: [String], default: [] }, // screenshot URLs

    repoUrl: { type: String, default: null },
    liveUrl: { type: String, default: null },

    featured: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
