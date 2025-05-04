const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const router = express.Router();
const REPO_DIR = path.join(__dirname, "../repositories");

// List all repos from filesystem
router.get("/", async (req, res) => {
  try {
    const repos = await fs.readdir(REPO_DIR);
    res.json({ success: true, repositories: repos });
  } catch (err) {
    console.error("❌ Error fetching repositories:", err);
    res.status(500).json({ error: "Failed to retrieve repositories" });
  }
});

// Get repo details
router.get("/:repoName", async (req, res) => {
  try {
    const repoName = req.params.repoName;
    const repoPath = path.join(REPO_DIR, repoName);

    try {
      await fs.access(repoPath);
    } catch {
      return res.status(404).json({ error: "Repository not found" });
    }

    const files = await fs.readdir(repoPath);
    res.json({ success: true, repository: repoName, files });
  } catch (err) {
    console.error("❌ Error fetching repository details:", err);
    res.status(500).json({ error: "Failed to retrieve repository details" });
  }
});

module.exports = router;
