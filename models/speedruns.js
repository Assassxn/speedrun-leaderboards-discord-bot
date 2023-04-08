const mongoose = require("mongoose");

const speendRunSchema = new mongoose.Schema(
    {
        userId: { type: String },
        mode: { type: String },
        speedRunType: { type: String },
        length: { type: Number },
        submittedAt: { type: Number },
        videoLink: { type: String },
    },
    {
        versionKey: false,
        timestamps: { createdAt: true, updatedAt: true },
    }
);

module.exports = new mongoose.model("Speedruns", speendRunSchema);