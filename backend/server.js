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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = ENV.PORT || 3000;

// ================= MIDDLEWARES =================
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

// ================= API =================
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ================= FRONTEND =================
const frontendPath = path.join(__dirname, "../admin/dist");

app.use(express.static(frontendPath));

// EXPRESS 5 SAFE CATCH-ALL
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ================= START =================
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on", PORT);
  console.log("Frontend path:", frontendPath);
  connectDB();
});
