const Post = require('../models/Post');
const FileContent = require('../models/FileContent');
const diff = require('diff');

// ... (keep your existing functions like createPost, addFileToPost, etc.)

// ✅ REWRITTEN: This helper function can now reconstruct the full state of a project at any version.
const reconstructFileState = async (versions, targetVersionNumber) => {
    if (!versions || versions.length === 0) return {};

    let fileState = {}; // { 'path/to/file': 'content' }

    // Start with the full content of the first version's files
    const firstVersion = versions[0];
    for (const fileRef of firstVersion.files) {
        const fileDoc = await FileContent.findById(fileRef.fileId);
        if (fileDoc) {
            fileState[fileRef.path] = fileDoc.content;
        }
    }

    // Apply patches sequentially up to the target version
    for (let i = 1; i <= targetVersionNumber; i++) {
        const version = versions[i];
        if (version && version.files) {
            for (const fileRef of version.files) {
                const fileDoc = await FileContent.findById(fileRef.fileId);
                if (fileDoc) {
                    if (fileDoc.patch) {
                        const oldContent = fileState[fileRef.path] || "";
                        const newContent = diff.applyPatch(oldContent, fileDoc.patch);
                        if (newContent !== false) {
                            fileState[fileRef.path] = newContent;
                        }
                    } else {
                        // This is a new file added in a later version
                        fileState[fileRef.path] = fileDoc.content;
                    }
                }
            }
        }
    }
    return fileState;
};

// ✅ REWRITTEN: This is the core logic for committing a new version.
exports.commitNewVersion = async (req, res) => {
    try {
        // The frontend will send an array of all files with their new content
        const { files: newFileStates, commitMessage } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ error: 'Post not found' });

        const latestVersionNumber = post.versions.length - 1;
        const oldFileState = await reconstructFileState(post.versions, latestVersionNumber);

        const newVersionFiles = [];
        
        // Compare the old file state with the new files to create patches
        for (const newFile of newFileStates) {
            const oldContent = oldFileState[newFile.path];
            
            if (oldContent !== undefined) { // File already exists
                if (oldContent !== newFile.content) { // Content has changed, create a patch
                    const patch = diff.createPatch(newFile.path, oldContent, newFile.content);
                    const newPatchContent = new FileContent({ postId: post._id, patch: patch });
                    const savedPatch = await newPatchContent.save();
                    newVersionFiles.push({ path: newFile.path, fileId: savedPatch._id });
                }
            } else { // This is a new file, store its full content
                const newFullContent = new FileContent({ postId: post._id, content: newFile.content });
                const savedContent = await newFullContent.save();
                newVersionFiles.push({ path: newFile.path, fileId: savedContent._id });
            }
        }

        if (newVersionFiles.length === 0) {
            return res.status(200).json({ message: "No changes to commit." });
        }

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

// ... (keep your other functions like getCodeForVersion, which will need updating later)
