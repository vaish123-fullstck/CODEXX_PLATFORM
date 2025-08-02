const User = require('../models/User');

// @desc    Add or remove a post from a user's favorites
// @route   POST /api/users/favorites/:postId
// @access  Private
exports.toggleFavorite = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { postId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isFavorite = user.favorites.includes(postId);

        if (isFavorite) {
            await User.updateOne({ _id: userId }, { $pull: { favorites: postId } });
            res.status(200).json({ message: 'Removed from favorites' });
        } else {
            await User.updateOne({ _id: userId }, { $addToSet: { favorites: postId } });
            res.status(200).json({ message: 'Added to favorites' });
        }
    } catch (error) {
        console.error("Error toggling favorite:", error);
        res.status(500).json({ error: "Server error while updating favorites." });
    }
};

// ✅ NEW: This function gets all of a user's favorite posts
// @desc    Get all favorite posts for the logged-in user
// @route   GET /api/users/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        // Find the user and populate the 'favorites' field.
        // This replaces the favorite IDs with the full post documents.
        const user = await User.findById(userId).populate({
            path: 'favorites',
            populate: { // We can even populate the author of each favorite post
                path: 'author',
                select: 'username' // Only select the username field
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user.favorites);

    } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({ error: "Server error while fetching favorites." });
    }
};
