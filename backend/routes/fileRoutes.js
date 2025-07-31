const express = require("express");
const multer = require("multer");
const fs = require("fs").promises;
const path = require("path");
//const Repository = require("../models/Repository");

const router = express.Router();
const REPO_DIR = path.join(__dirname, "../repositories");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload files
router.post("/upload-files", upload.array("files"), async (req, res) => {
  try {
    const { userId, folderName } = req.body;
    if (!userId || !folderName || !req.files.length) {
      return res.status(400).json({ error: "Missing required fields or files" });
    }

    const basePath = path.join(REPO_DIR, userId, folderName);
    await fs.mkdir(basePath, { recursive: true });

    const fileEntries = [];

    for (const file of req.files) {
      const filePath = path.join(basePath, file.originalname);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, file.buffer);

      fileEntries.push({
        name: file.originalname,
        path: filePath,
        isDirectory: false,
      });
    }

    const repository = new Repository({
      userId,
      folderName,
      files: fileEntries,
    });

    await repository.save();

    res.json({ success: true, message: "Files uploaded and saved", repository });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ error: "Server error during upload" });
  }
});

// Get repositories of a user
router.get("/my-repositories/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const repos = await Repository.find({ userId });
    res.json({ success: true, repositories: repos });
  } catch (error) {
    console.error("❌ Fetch error:", error);
    res.status(500).json({ error: "Could not fetch repositories" });
  }
});

module.exports = router;
