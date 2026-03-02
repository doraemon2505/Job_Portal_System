const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Job description is required"],
    },

    requirements: [
      {
        type: String,
        trim: true,
      },
    ],

    salary: {
      min: {
        type: Number,
        default: 0,
        min: 0,
      },
      max: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    location: {
      type: String,
      required: [true, "Job location is required"],
      trim: true,
    },

    jobType: {
      type: String,
      enum: ["full-time", "part-time", "remote", "internship", "contract"],
      default: "full-time",
    },

    experienceRequired: {
      type: String,
      trim: true,
      default: "0",
    },

    thumbnail: {
      type: String,
      default: "",
    },

    company: {
      name: {
        type: String,
        required: [true, "Company name is required"],
        trim: true,
      },
      logo: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
      location: {
        type: String,
        default: "",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);