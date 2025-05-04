const File = require("../models/File");
const fs = require("fs-extra");
const path = require("path");

const BASE_DIR = path.join(__dirname, "..", "uploads");

// 📁 Get all files & folders
exports.getFiles = async (req, res) => {
    try {
        const files = await File.find();
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: "Error fetching files" });
    }
};

// 📁 Create Folder
exports.createFolder = async (req, res) => {
    const { name, parentId } = req.body;
    const folderPath = path.join(BASE_DIR, name);

    try {
        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
        const folder = await File.create({ name, type: "folder", parent: parentId || null, path: folderPath });
        res.json(folder);
    } catch (error) {
        res.status(500).json({ error: "Error creating folder" });
    }
};

// 📄 Create File
exports.createFile = async (req, res) => {
    const { name, parentId } = req.body;
    const filePath = path.join(BASE_DIR, name);

    try {
        fs.writeFileSync(filePath, ""); // Create an empty file
        const file = await File.create({ name, type: "file", parent: parentId || null, path: filePath });
        res.json(file);
    } catch (error) {
        res.status(500).json({ error: "Error creating file" });
    }
};

// ✏️ Rename File/Folder
exports.renameFile = async (req, res) => {
    const { id } = req.params;
    const { newName } = req.body;

    try {
        const file = await File.findById(id);
        if (!file) return res.status(404).json({ error: "File/Folder not found" });

        const newPath = path.join(BASE_DIR, newName);
        fs.renameSync(file.path, newPath);

        file.name = newName;
        file.path = newPath;
        await file.save();

        res.json(file);
    } catch (error) {
        res.status(500).json({ error: "Error renaming file" });
    }
};

// 🗑 Delete File/Folder
exports.deleteFile = async (req, res) => {
    const { id } = req.params;

    try {
        const file = await File.findById(id);
        if (!file) return res.status(404).json({ error: "File/Folder not found" });

        fs.removeSync(file.path); // Delete from disk
        await File.findByIdAndDelete(id); // Delete from DB

        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting file" });
    }
};
