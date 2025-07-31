// backend/server.js

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Import all your route files
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");

const postRoutes = require("./routes/postRoutes"); // The new routes for posts

// Load environment variables and connect to the database
dotenv.config();
connectDB();

const app = express();

// --- Core Middleware ---
app.use(express.json());
app.use(morgan("dev"));

// --- CORS Configuration ---
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
}));

// --- API Routes ---
// All routes are now neatly organized and imported
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

app.use("/api/posts", postRoutes); // Using the new post routes

// --- Static File Serving ---
// It's good practice to have these defined
const UPLOADS_DIR = path.join(__dirname, "uploads");
const REPO_DIR = path.join(__dirname, "repositories");
app.use("/uploads", express.static(UPLOADS_DIR));
app.use("/repositories", express.static(REPO_DIR));

// NOTE: The Electron-specific routes can also be moved to their own controller and route files!
app.get("/is-electron-running", (req, res) => {
    res.json({ status: "success", message: "Electron app is running!" });
});
app.get("/api/electron-handshake", (req, res) => {
    res.json({ status: "success", message: "Website backend received handshake from Electron." });
});


// --- Global Error Handler ---
// This should be the last piece of middleware
app.use(errorHandler);


// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});