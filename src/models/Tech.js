import mongoose from "mongoose";

const techSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 80,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    category: {
      type: String,
      enum: [
        "frontend",
        "backend",
        "database",
        "devops",
        "tool",
        "language",
        "other",
      ],
      default: "other",
    },
    icon: { type: String, default: null }, // URL or icon key (lucide/react icon name)
    website: { type: String, default: null },
    color: { type: String, default: null }, // hex or CSS var
  },
  { timestamps: true }
);

const Tech = mongoose.model("Tech", techSchema);
export default Tech;
