import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// @desc    Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Note: Default role is 'user' from the Model
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully",
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login User & Admin
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // UPDATE: Included 'role' in the JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // UPDATE: Send role back to Frontend
        res.json({
            token,
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Seed Initial Admin 
export const seedAdmin = async (req, res) => {
    try {
        const adminExists = await User.findOne({ role: "admin" });
        
        if (adminExists) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash("admin123", 12);
        
        const admin = await User.create({
            name: "Master Admin",
            email: "admin@heyireeh.com",
            password: hashedPassword,
            role: "admin"
        });

        res.status(201).json({ 
            message: "Admin seeded successfully", 
            email: admin.email,
            password: "admin123" 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};