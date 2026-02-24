import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectUsersDB, connectProductsDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import faqRoutes from "./routes/faq.routes.js";
import adminFaqRoutes from "./routes/adminFaqRoutes.js";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 5000;

console.log("Port is", PORT);

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.send("Hello World! Backend is running.");
});

// API Routes
app.use("/api/users", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/admin/faqs", adminFaqRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.url}` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// Start server
const start = async () => {
  try {
    // Connect both databases
    await connectUsersDB();
    await connectProductsDB();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`   Auth routes:    /api/users`);
      console.log(`   Product routes: /api/products`);
      console.log(`   FAQ routes:     /api/faqs\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

start();