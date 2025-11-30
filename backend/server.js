import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/database.js";
import errorHandler from "./middlewares/errorHandler.js";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import homeRoutes from "./routes/home.routes.js";
import reportRoutes from "./routes/report.routes.js";
import noteRoutes from "./routes/note.routes.js";
import firstAidRoutes from "./routes/firstAid.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import authRoutes from "./routes/auth.routes.js";
import doctorRequestRoutes from "./routes/doctorRequest.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import consultationRoutes from "./routes/consultation.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminMessageRoutes from "./routes/adminMessage.routes.js";

dotenv.config();

const app = express();

connectDB().catch((err) => {
  console.error("Database connection failed:", err.message);
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "تم تجاوز عدد الطلبات المسموح به، يرجى المحاولة لاحقاً",
});

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/api", limiter);

// Serve static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

app.get("/", (req, res) => {
  res.json({
    message: "مرحباً بك في E-HSPTL Backend API",
    version: "1.0.0",
    endpoints: {
      home: "/api/home",
      reports: "/api/reports",
      notes: "/api/notes",
      firstAid: "/api/first-aid",
      contact: "/api/contact",
      auth: "/api/auth",
      doctorRequests: "/api/doctor-requests",
      notifications: "/api/notifications",
    },
  });
});

app.use("/api/home", homeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/first-aid", firstAidRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/doctor-requests", doctorRequestRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin-messages", adminMessageRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
});

export default app;
