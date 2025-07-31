const mongoose = require('mongoose');

// A schema to represent a single file's metadata within a version
const FileSchema = new mongoose.Schema({
    path: { type: String, required: true }, // e.g., "src/components/Button.jsx"
    // Reference to the document that holds the actual content
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'FileContent', required: true }
});

const VersionSchema = new mongoose.Schema({
    commitMessage: { type: String, required: true },
    versionNumber: { type: Number, required: true },
    files: [FileSchema] 
}, { timestamps: true });

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    blogContent: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    versions: [VersionSchema],
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
