import express from "express";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import { DEFAULT_SENDER_EMAIL, DEFAULT_EMAIL_FROM } from "../config/emailDefaults.js";

dotenv.config();

const router = express.Router();
const otpStorage = {}; // Temporary storage for OTPs

// Email transporter — set EMAIL_USER and EMAIL_PASSWORD in .env (e.g. Gmail app password)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER || DEFAULT_SENDER_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Clean up expired OTPs every minute
setInterval(() => {
    const now = Date.now();
    for (const email in otpStorage) {
        if (otpStorage[email].expiresAt < now) {
            delete otpStorage[email];
        }
    }
}, 60 * 1000);

// Send OTP to email
router.post("/send-otp", async (req, res) => {
    const { name, email, phone } = req.body;

    // Validate required fields
    if (!name?.trim() || !email || !phone) {
        return res.status(400).json({
            success: false,
            message: "Name, email, and phone are required",
        });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please login.",
            });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStorage[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // 5 minutes

        // Send OTP via email
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER || DEFAULT_EMAIL_FROM,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
        });

        console.log("Sending OTP Payload:", {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
        });

        res.json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (error) {
        console.error("OTP send error:", error);

        // Handle email sending errors
        if (error.code === "EAUTH" || error.code === "EENVELOPE") {
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP. Please check your email configuration.",
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to send OTP. Please try again.",
        });
    }
});

// Verify OTP
router.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: "Email and OTP are required",
        });
    }

    const storedData = otpStorage[email];

    // Check OTP existence
    if (!storedData) {
        return res.status(400).json({
            success: false,
            message: "OTP not found or expired",
        });
    }

    // Check expiration
    if (Date.now() > storedData.expiresAt) {
        delete otpStorage[email];
        return res.status(400).json({
            success: false,
            message: "OTP expired. Please request a new one.",
        });
    }

    // Validate OTP
    if (otp !== storedData.otp) {
        return res.status(400).json({
            success: false,
            message: "Invalid OTP",
        });
    }

    // Mark OTP as verified
    storedData.verified = true;
    res.json({
        success: true,
        message: "OTP verified. Please create your password.",
    });
});

// Complete registration
router.post("/register", async (req, res) => {
    console.log("=== REGISTRATION DEBUG START ===");
    console.log("Raw request body:", JSON.stringify(req.body));
    console.log("Password field type:", typeof req.body.password);
    console.log("Password field length:", req.body.password?.length);
    console.log("Password field value (first 50 chars):", req.body.password?.substring(0, 50));
    console.log("=== REGISTRATION DEBUG END ===");

    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name?.trim() || !email || !password || !phone) {
        return res.status(400).json({
            success: false,
            message: "Name, email, password, and phone are required",
        });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please login.",
            });
        }

        // Create new user - password will be hashed by the pre-save middleware
        const newUser = new User({
            name: name.trim(),
            email: email.toLowerCase(),
            password: password, // Don't hash here - let the model's pre-save hook handle it
            phone: phone.replace(/\D/g, ""), // Clean phone number
        });

        await newUser.save();

        // Generate JWT token
        const token = generateToken(newUser);

        res.json({
            success: true,
            message: "Registration successful!",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);

        // Handle Mongoose validation errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: messages,
            });
        }

        res.status(500).json({
            success: false,
            message: "Registration failed. Please try again.",
        });
    }
});

// Helper function for JWT generation
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET, // Use a secret key from environment variables
        { expiresIn: "1h" } // Token expires in 1 hour
    );
};

export default router;