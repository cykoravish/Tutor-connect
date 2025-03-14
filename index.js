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

/* ========================
   Middlewares
======================== */

// Security-related middlewares
app.use(helmet()); // Sets secure HTTP headers

// CSP configuration (after helmet())
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "https://unpkg.com", "https://cdn.jsdelivr.net"],
      "script-src-elem": [
        "'self'",
        "https://unpkg.com",
        "https://cdn.jsdelivr.net",
      ],
      "style-src": [
        "'self'",
        "'unsafe-inline'",
        "https://unpkg.com",
        "https://cdn.jsdelivr.net",
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com",
      ],
      "style-src-elem": [
        "'self'",
        "'unsafe-inline'",
        "https://unpkg.com",
        "https://cdn.jsdelivr.net",
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com",
      ],
      "img-src": [
        "'self'",
        "data:",
        "https://images.unsplash.com", // ✅ Images from Unsplash
      ],
      "font-src": [
        "'self'",
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com", // Optional if you load fonts from cdnjs
      ],
      "connect-src": ["'self'"],
      "object-src": ["'none'"],
    },
  })
);

app.use(mongoSanitize());
app.use(xssFilter);
app.use(hpp());

// Body parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// CORS setup
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
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

// Rate Limiting
app.use(
  "/api",
  rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!",
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/* ========================
   Static Files & API Routes
======================== */

app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/auth", userRouter);

// SPA Routing Fallback (if you have a frontend)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

/* ========================
   404 Handler
======================== */
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

/* ========================
   Global Error Handler
======================== */
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

/* ========================
   Start Server & Connect DB
======================== */
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port $ http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      "❌ Failed to connect to database. Server not started:",
      error
    );
    process.exit(1);
  });
