import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";

import { ENV } from "./src/config/env.js";
import { connectDB } from "./src/config/db.js";
import { functions, inngest } from "./src/config/inggest.js";

// =======================
// FIX __dirname FOR ESM
// =======================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =======================
const app = express();
const PORT = ENV.PORT || 3000;

// =======================
// MIDDLEWARES
// =======================
app.use(
  cors({
    origin: ENV.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

// =======================
// API ROUTES
// =======================
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

// =======================
// FRONTEND (ALL-IN-ONE)
// =======================
if (ENV.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../admin/dist");

  console.log("Frontend path:", frontendPath);
  
  app.use(express.static(frontendPath));
  
  app.get("/*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// =======================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
