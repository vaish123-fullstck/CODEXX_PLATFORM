const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs").promises;
const multer = require("multer");
const AdmZip = require("adm-zip");

const connectDB = require("./config/db");
const { router: authRoutes } = require("./routes/authRoutes"); // ✅ FIXED
const fileRoutes = require("./routes/fileRoutes");
const repoRoutes = require("./routes/repoRoutes");
const errorHandler = require("./middleware/errorHandler");

const memoryStorage = multer.memoryStorage();
const uploadMemory = multer({ storage: memoryStorage });

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(morgan("dev"));

// ✅ Directory Setup
const UPLOADS_DIR = path.join(__dirname, "uploads");
const REPO_DIR = path.join(__dirname, "repositories");

(async () => {
    try {
        await fs.mkdir(UPLOADS_DIR, { recursive: true });
        await fs.mkdir(REPO_DIR, { recursive: true });
    } catch (error) {
        console.error("❌ Error creating directories:", error);
    }
})();

// ✅ CORS Configuration
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://localhost:3001"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        res.sendStatus(200);
    } else {
        next();
    }
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/repos", repoRoutes);

// ✅ Static Files
app.use("/uploads", express.static(UPLOADS_DIR));
app.use("/repositories", express.static(REPO_DIR));

// ✅ Electron Status Check
app.get("/is-electron-running", (req, res) => {
    res.json({ status: "success", message: "Electron app is running!" });
});

app.get("/api/electron-handshake", (req, res) => {
    console.log("🤝 Website Backend: Received connection check from Electron App.");
    res.json({ status: "success", message: "Website backend received handshake from Electron." });
});

// ✅ Upload ZIP and Extract (fallback)
const zipStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const zipUpload = multer({ storage: zipStorage });

app.post("/api/files/upload-zip", zipUpload.single("file"), async (req, res) => {
    if (!req.file) {
        console.error("❌ No ZIP file received.");
        return res.status(400).json({ error: "No file uploaded." });
    }

    const zipPath = req.file.path;
    const extractDir = path.join(REPO_DIR, path.basename(zipPath, ".zip"));

    try {
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractDir, true);

        console.log("✅ ZIP extracted to:", extractDir);

        return res.json({
            message: "✅ ZIP uploaded and extracted successfully!",
            extractedPath: extractDir
        });
    } catch (err) {
        console.error("❌ ZIP extraction failed:", err.message);
        return res.status(500).json({ error: "ZIP extraction failed" });
    }
});

// ✅ GitHub-style File Upload
app.post("/api/files/upload-file", uploadMemory.single("file"), async (req, res) => {
    try {
        const relativePath = req.body.relativePath;
        const fileBuffer = req.file.buffer;

        if (!relativePath) {
            return res.status(400).json({ error: "Missing relative path" });
        }

        const savePath = path.join(REPO_DIR, relativePath);
        const dirPath = path.dirname(savePath);

        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(savePath, fileBuffer);

        res.status(200).json({ message: `Uploaded: ${relativePath}` });
    } catch (err) {
        console.error("❌ Upload failed:", err.message);
        res.status(500).json({ error: "Upload failed" });
    }
});

// ✅ Recursive File Listing
const walkDirectory = async (dir, base = "") => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const results = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(base, entry.name);

        if (entry.isDirectory()) {
            results.push({
                type: "folder",
                name: entry.name,
                path: relativePath,
                children: await walkDirectory(fullPath, relativePath)
            });
        } else {
            results.push({
                type: "file",
                name: entry.name,
                path: relativePath
            });
        }
    }

    return results;
};

app.get("/api/files/list", async (req, res) => {
    try {
        const structure = await walkDirectory(REPO_DIR);
        res.json(structure);
    } catch (err) {
        console.error("❌ Failed to list files:", err.message);
        res.status(500).json({ error: "Failed to list files" });
    }
});

// ✅ Global Error Handler
app.use(errorHandler);

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
