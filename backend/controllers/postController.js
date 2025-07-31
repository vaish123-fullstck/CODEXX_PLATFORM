const Post = require('../models/Post');
const diff = require('diff');

const FileContent = require('../models/FileContent');

// CREATE POST (METADATA ONLY)
exports.createPost = async (req, res) => {
    try {
        const { title, blogContent, userId } = req.body;
        const initialVersion = {
            commitMessage: 'Initial commit',
            versionNumber: 0,
            files: [] // Starts empty
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

        // 1. Create a new document to store the file's content
        const newFileContent = new FileContent({
            postId: postId,
            content: fileContent
        });
        const savedFileContent = await newFileContent.save();

        // 2. Get the latest version from the post
        const latestVersion = post.versions[post.versions.length - 1];
        
        // 3. Add a reference (the ID) to the file content in the post's file array
        latestVersion.files.push({
            path: path,
            fileId: savedFileContent._id // <-- Store the reference ID, not the content
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

// GET A SINGLE POST BY ID
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching single post:", error);
        res.status(500).json({ error: "Server error while fetching post." });
    }
};

// HELPER FUNCTION TO RECONSTRUCT FILE STATE FOR A SPECIFIC VERSION
const reconstructFileState = (versions, targetVersionNumber) => {
    if (!versions || versions.length === 0) return {};
    let fileState = {}; // { 'path/to/file': 'content' }

    // Start with the full content of the first version's files
    versions[0].files.forEach(file => {
        fileState[file.path] = file.content;
    });

    // Apply patches sequentially up to the target version
    for (let i = 1; i <= targetVersionNumber; i++) {
        if (versions[i] && versions[i].files) {
            versions[i].files.forEach(file => {
                if (file.patch) {
                    const oldContent = fileState[file.path] || "";
                    const newContent = diff.applyPatch(oldContent, file.patch);
                    if (newContent !== false) {
                        fileState[file.path] = newContent;
                    }
                } else {
                    // This is a new file, add it with its full content
                    fileState[file.path] = file.content;
                }
            });
        }
    }
    return fileState;
};

// COMMIT A NEW VERSION (MULTI-FILE)
exports.commitNewVersion = async (req, res) => {
    try {
        const { files: newFiles, commitMessage } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const latestVersionNumber = post.versions.length - 1;
        const oldFileState = reconstructFileState(post.versions, latestVersionNumber);
        const newVersionFiles = [];
        
        newFiles.forEach(newFile => {
            const oldContent = oldFileState[newFile.path];
            if (oldContent !== undefined) { // File exists, create a patch
                if (oldContent !== newFile.content) {
                    const patch = diff.createPatch(newFile.path, oldContent, newFile.content);
                    newVersionFiles.push({ path: newFile.path, patch: patch });
                }
            } else { // This is a new file, store its full content
                newVersionFiles.push({ path: newFile.path, content: newFile.content });
            }
        });

        const newVersion = {
            commitMessage,
            versionNumber: post.versions.length,
            files: newVersionFiles
        };

        post.versions.push(newVersion);
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.error("Error committing new version:", error);
        res.status(500).json({ error: "Server error while committing." });
    }
};

// GET A SPECIFIC VERSION OF A POST'S CODE
exports.getCodeForVersion = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const versionNumber = parseInt(req.params.versionNumber, 10);

        if (!post || !post.versions[versionNumber]) {
            return res.status(404).json({ error: 'Post or version not found' });
        }

        const fileState = reconstructFileState(post.versions, versionNumber);
        // This endpoint will need to be updated to return a specific file's content
        // For now, let's just return the whole file state for debugging
        res.status(200).json({ files: fileState });

    } catch (error) {
        res.status(500).json({ error: "Server error while fetching version." });
    }
};