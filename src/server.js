import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import fs from "fs";
import path from "path";
import authRouter from "./routes/auth.routes.js";
import userDetailRouter from "./routes/userDetails.routes.js";
import projectRouter from "./routes/project.routes.js";
import adminLogsRouter from "./routes/adminLogs.routes.js";
import { CLIENT_URL, NODE_ENV, MONGO_URI, PORT } from "./data/secrets.js";
import { setupLogging } from "./utils/setupLogging.js";

// Load environment variables

const app = express();

setupLogging(app, { env: process.env.NODE_ENV });

// ✅ 1. Security Middlewares
app.use(helmet()); // Secure HTTP headers
app.use(
  cors({
    origin: CLIENT_URL, // Only your Vercel site
    credentials: true, // Allow cookies/headers
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

// ✅ 2. Body Parsing
app.use(express.json({ limit: "10kb" })); // Parse JSON requests with limit

// ✅ 3. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // Limit each IP
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// ✅ 4. Logging
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ✅ 5. Basic Route
app.get("/", (req, res) => {
  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "sample-content.json"
  );
  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);

  res.send(data.html);
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user-details", userDetailRouter);
app.use("/api/project", projectRouter);
app.use("/api/logs", adminLogsRouter);

// ✅ 6. Unknown Routes (404)
app.use(notFound);

// ✅ 7. Global Error Handler
app.use(errorHandler);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
