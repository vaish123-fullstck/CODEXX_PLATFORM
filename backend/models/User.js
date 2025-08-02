const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // ✅ NEW: An array to store the IDs of the user's favorite posts.
    // The 'ref' tells Mongoose that these IDs refer to documents in the 'Post' collection.
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

const User = mongoose.model("User", userSchema);
module.exports = User;
