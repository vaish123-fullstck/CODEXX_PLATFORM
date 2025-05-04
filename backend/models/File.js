const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Track user files
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true }, // ✅ Store file size
    uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", fileSchema);
