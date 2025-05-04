const mongoose = require("mongoose");

const UserFolderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    folderPath: { type: String, required: true },
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }], // ✅ Track extracted files
    uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserFolder", UserFolderSchema);
