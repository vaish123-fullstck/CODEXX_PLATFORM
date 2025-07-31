const express = require('express');
const router = express.Router();
const multer = require('multer');

// Import all controller functions
const { 
    createPost, 
    addFileToPost,
    getAllPosts, 
    getPostById,
    commitNewVersion,
    getCodeForVersion,
} = require('../controllers/postController');

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Define All Routes ---

// POST /api/posts - Create a new post (metadata only)
router.post('/', createPost);

// POST /api/posts/:id/files - Add a single file to a post's latest version
router.post('/:id/files', upload.single('content'), addFileToPost);

// GET /api/posts - Get a list of all posts
router.get('/', getAllPosts);

// GET /api/posts/:id - Get a single post by its ID
router.get('/:id', getPostById);

// GET /api/posts/:id/versions/:versionNumber - Get the code for a specific version
router.get('/:id/versions/:versionNumber', getCodeForVersion);

// POST /api/posts/:id/versions - Commit a new version of a post
router.post('/:id/versions', commitNewVersion);

module.exports = router;
