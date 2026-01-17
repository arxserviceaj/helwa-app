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
import adminRoutes from "./src/routes/admin.route.js";
import userRoutes from "./src/routes/user.route.js";
import orderRoutes from "./src/routes/order.route.js";
import reviewRoutes from "./src/routes/review.route.js";
import productRoutes from "./src/routes/product.route.js";

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
app.use("/api/admin",adminRoutes)
app.use("/api/users",userRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/reviews",reviewRoutes)
app.use("/api/products",productRoutes)

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
