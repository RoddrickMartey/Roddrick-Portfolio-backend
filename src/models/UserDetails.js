import mongoose from "mongoose";

const socialsSchema = new mongoose.Schema(
  {
    github: { type: String, default: null },
    linkedin: { type: String, default: null },
    twitter: { type: String, default: null },
    website: { type: String, default: null },
    youtube: { type: String, default: null },
    instagram: { type: String, default: null },
  },
  { _id: false }
);

const userDetailsSchema = new mongoose.Schema(
  {
    // Link to auth user (optional but recommended)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true,
    },

    fullName: { type: String, required: true, trim: true, maxlength: 100 },

    headline: { type: String, required: true, trim: true, maxlength: 140 },

    // Array of paragraph strings
    bio: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Bio must include at least one paragraph.",
      },
    },

    homeImage: { type: String, default: null }, // hero / landing
    aboutImage: { type: String, default: null }, // about page

    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email."],
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
      // optional loose phone pattern (international-ish, digits + + - space)
      match: [/^[+()\-\s0-9]*$/, "Invalid phone format."],
    },

    location: { type: String, trim: true, default: null },

    techStack: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    socials: {
      type: socialsSchema,
      default: () => ({}),
    },

    availableForWork: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserDetails = mongoose.model("UserDetails", userDetailsSchema);
export default UserDetails;
