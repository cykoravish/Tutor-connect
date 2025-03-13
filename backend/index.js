import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import userRouter from "./src/routes/user.route.js";
import connectDB from "./src/database/dbConnect.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { xssFilter } from "./src/middlewares/xss-filter.js";
import hpp from "hpp";

// Initialize environment variables
dotenv.config();

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: "10kb" })); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true, limit: "10kb" })); // Parse URL-encoded request bodies
app.use(cookieParser());
app.use(helmet());

// CORS configuration for cookies
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:5500",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "X-CSRF-Token",
    ],
  })
);

// Rate limiting
const limiter = rateLimit({
  max: 100, // 100 requests per IP
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Security middleware
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xssFilter); // Custom XSS protection middleware
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Static files
app.use(express.static(path.join(__dirname, "public")));
// Routes
app.use("/api/auth", userRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database. Server not started:", error);
    process.exit(1);
  });
