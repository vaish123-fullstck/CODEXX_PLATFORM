const mongoose = require('mongoose');

const FileContentSchema = new mongoose.Schema({
    // Reference to the parent post
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    // The actual content of the file
    content: { type: String, required: true },
});

module.exports = mongoose.model('FileContent', FileContentSchema);
