const express = require('express');
const router = express.Router();
const { toggleFavorite, getFavorites } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Route to add/remove a favorite
router.post('/favorites/:postId', authMiddleware, toggleFavorite);

// ✅ NEW: Route to get all of a user's favorites
router.get('/favorites', authMiddleware, getFavorites);

module.exports = router;
