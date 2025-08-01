const express = require('express');
const router = express.Router();
const multer = require('multer');

// Import all controller functions in a single, clean block
const { 
    createPost, 
    addFileToPost,
    getAllPosts, 
    getPostById,
    commitNewVersion,
    getCodeForVersion,
    addComment,
    deletePost
} = require('../controllers/postController');

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Define All Routes ---

// POST routes
router.post('/', createPost);
router.post('/:id/files', upload.single('content'), addFileToPost);
router.post('/:id/comments', addComment);
router.post('/:id/versions', commitNewVersion);

// GET routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.get('/:id/versions/:versionNumber', getCodeForVersion);

// DELETE route
router.delete('/:id', deletePost);

module.exports = router;
