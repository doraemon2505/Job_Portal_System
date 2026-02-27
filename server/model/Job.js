const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        requirements: [
            {
                type: String,
            },
        ],

        salary: {
            min: {
                type: Number,
                default: 0,
            },
            max: {
                type: Number,
                default: 0,
            },
        },

        location: {
            type: String,
            required: true,
        },

        jobType: {
            type: String,
            enum: ["full-time", "part-time", "remote", "internship", "contract"],
            default: "full-time",
        },

        experienceRequired: {
            type: Number, // in years
            default: 0,
        },

        // Optional Thumbnail
        thumbnail: {
            type: String, // image URL
            default: "",
        },

        // Company Information (Embedded)
        company: {
            name: {
                type: String,
                required: true,
            },
            logo: {
                type: String, // optional logo URL
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