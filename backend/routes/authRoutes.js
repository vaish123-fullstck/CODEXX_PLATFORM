const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authMiddleware } = require("../middleware/authMiddleware");
require("dotenv").config();

const router = express.Router();

// ... (Signup route remains the same)

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }); // Find user
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // ✅ Return the full user object, including favorites
        res.json({
            token,
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email,
                favorites: user.favorites // Include favorites
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// GET current user
router.get("/me", authMiddleware, async (req, res) => {
    try {
        // ✅ The middleware already attaches the full user object, including favorites
        if (!req.user) return res.status(404).json({ message: "User not found" });
        res.json({ user: req.user });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user" });
    }
});

module.exports = router;
