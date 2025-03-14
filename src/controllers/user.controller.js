import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { sanitizeInput } from "../utils/sanitize.js";
import { validateRegistration } from "../middlewares/validators.js";

export const registerUser = [
  // Apply validation middleware
  ...validateRegistration(),

  async (req, res) => {
    try {
      // Check validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      // Extract user data from request body
      const { name, email, password } = req.body;

      // Sanitize inputs to prevent NoSQL injection
      const sanitizedName = sanitizeInput(name);
      const sanitizedEmail = sanitizeInput(email);

      // Check if user already exists
      const existingUser = await User.findOne({ email: sanitizedEmail });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      // Hash password with appropriate cost factor (12 is recommended for security)
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user
      const newUser = new User({
        name: sanitizedName,
        email: sanitizedEmail,
        password: hashedPassword,
      });

      // Save user to database
      await newUser.save();

      // Create JWT token
      const token = jwt.sign(
        { id: newUser._id, name: newUser.name, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } // 7 days is a good balance between security and convenience
      );

      // Set JWT in HTTP-only cookie
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        path: "/",
      });

      // Return success response with user data (excluding password)
      const userResponse = {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      };

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: userResponse,
      });
    } catch (error) {
      console.error("Registration error:", error);

      // Handle validation errors from Mongoose
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((val) => val.message);
        return res.status(400).json({
          success: false,
          message: messages.join(", "),
        });
      }

      res.status(500).json({
        success: false,
        message: "Server error during registration",
      });
    }
  },
];

export const loginUser = async (req, res) => {
  try {
    // Extract login credentials from request body
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Sanitize email input
    const sanitizedEmail = sanitizeInput(email);

    // Find user by email
    const user = await User.findOne({ email: sanitizedEmail }).select(
      "+password"
    );
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // 7 days is a good balance between security and convenience
    );

    // Set JWT in HTTP-only cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "lax", // Provides CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      path: "/",
    });

    // Return success response with user data (excluding password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

export const logout = (req, res) => {
  // Clear the auth cookie by setting it to expire immediately
  res.cookie("auth_token", "", {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

export const profile = async (req, res) => {
  try {
    // Get user from database (excluding password)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
};
