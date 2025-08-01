const mongoose = require('mongoose');

const FileContentSchema = new mongoose.Schema({
    // Reference to the parent post
    postId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post', 
        required: true 
    },
    
    // ✅ FIX: The 'content' field is now correctly defined.
    // It is not required and will default to an empty string if no content is provided.
    content: { 
        type: String, 
        default: '' 
    },
});

module.exports = mongoose.model('FileContent', FileContentSchema);
