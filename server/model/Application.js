const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
        },

        resumeUrl: {
            type: String,
            required: true
      },

        status: {
            type: String,
            enum: ["pending", "reviewed", "shortlisted", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);