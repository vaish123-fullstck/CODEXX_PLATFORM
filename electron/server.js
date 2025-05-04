const express = require("express");
const cors = require("cors");

const server = express();
const PORT = 3001;

// ✅ CORS Configuration
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],  
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true  // Allow cookies/session-based authentication
};

// ✅ Apply CORS Middleware Globally (No need for manual headers)
server.use(cors(corsOptions));

// ✅ Middleware for JSON parsing
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// ✅ Fix: Remove duplicate manual headers (CORS is already handled)

// ✅ Health Check Route (Ensures Electron can check server status)
server.get("/is-electron-running", (req, res) => {
    res.json({ status: "Electron is running!" });
});

// ✅ Test API Route (For checking CORS issues)
server.get("/api/test", (req, res) => {
    res.json({ message: "CORS is now working perfectly!" });
});

// ✅ Start the server
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
