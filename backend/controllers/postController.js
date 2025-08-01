const Post = require('../models/Post');
const FileContent = require('../models/FileContent');
const diff = require('diff');

// CREATE POST (METADATA ONLY)
exports.createPost = async (req, res) => {
    try {
        const { title, blogContent, userId } = req.body;
        const initialVersion = {
            commitMessage: 'Initial commit',
            versionNumber: 0,
            files: []
        };
        const newPost = new Post({
            title,
            blogContent,
            author: userId,
            versions: [initialVersion]
        });
        const savedPost = await newPost.save();
        res.status(201).json(savedPost); 
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Server error while creating post." });
    }
};

// ADD A SINGLE FILE TO A POST
exports.addFileToPost = async (req, res) => {
    try {
        const { path } = req.body;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!req.file) return res.status(400).json({ error: 'No file provided.' });
        if (!post) return res.status(404).json({ error: 'Post not found' });
        
        const fileContent = req.file.buffer.toString('utf-8');

        const newFileContent = new FileContent({
            postId: postId,
            content: fileContent
        });
        const savedFileContent = await newFileContent.save();

        const latestVersion = post.versions[post.versions.length - 1];
        
        latestVersion.files.push({
            path: path,
            fileId: savedFileContent._id
        });

        await post.save();
        res.status(200).json({ message: `File ${path} added successfully.`});

    } catch (error) {
        console.error("Error adding file to post:", error);
        res.status(500).json({ error: "Server error while adding file." });
    }
};

// GET ALL POSTS
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Server error while fetching posts." });
    }
};

// GET A SINGLE POST BY ID (WITH FILE CONTENT POPULATED)
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username')
            .populate('comments.author', 'username') // Also populate comment authors
            .populate({
                path: 'versions.files.fileId',
                model: 'FileContent'
            });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching single post:", error);
        res.status(500).json({ error: "Server error while fetching post." });
    }
};

// ADD A COMMENT TO A POST
exports.addComment = async (req, res) => {
    try {
        const { text, userId } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const newComment = {
            text: text,
            author: userId
        };

        post.comments.unshift(newComment);
        await post.save();

        const populatedPost = await Post.findById(req.params.id).populate('comments.author', 'username');
        res.status(201).json(populatedPost.comments);

    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ error: "Server error while adding comment." });
    }
};

// DELETE A POST
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const fileContentIds = post.versions.flatMap(version => 
            version.files.map(file => file.fileId)
        );

        if (fileContentIds.length > 0) {
            await FileContent.deleteMany({ _id: { $in: fileContentIds } });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Post and associated files deleted successfully.' });

    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Server error while deleting post." });
    }
};


// --- VERSIONING FUNCTIONS (PLACEHOLDERS FOR NOW) ---

const reconstructFileState = (versions, targetVersionNumber) => {
    // This logic will need to be fully implemented for versioning feature
    return {};
};

exports.commitNewVersion = async (req, res) => {
    // This logic will need to be fully implemented for versioning feature
    res.status(501).json({ message: "File-based versioning not yet implemented." });
};

exports.getCodeForVersion = async (req, res) => {
    // This logic will need to be fully implemented for versioning feature
    res.status(501).json({ message: "File-based version reconstruction not yet implemented." });
};
