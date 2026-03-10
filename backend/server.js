import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectUsersDB, connectProductsDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import faqRoutes from "./routes/faq.routes.js";
import adminFaqRoutes from "./routes/adminFaqRoutes.js";
import orderRoutes from "./routes/orders.js"; 
import uploadRoutes from "./routes/upload.js"; 
import reviewRoutes from "./routes/reviews.js"; 
import sellerSubmissionRoutes from "./routes/sellerSubmissions.js"; // ← ADD THIS






dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 5000;

console.log("Port is", PORT);

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000","https://ecommerce-2-87o9.onrender.com", "https://ecommerce-seven-gamma-40.vercel.app"],
  credentials: true,
}));
app.use(express.json({limit : "50mb"}));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Test route
app.get("/", (req, res) => {
  res.send("Hello World! Backend is running.");
});

// API Routes
app.use("/api/users", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);  
app.use("/api/faqs", faqRoutes);
app.use("/api/admin/faqs", adminFaqRoutes);
app.use("/api/upload", uploadRoutes); 
app.use("/api/products", reviewRoutes); 
app.use("/api/seller-submissions", sellerSubmissionRoutes); // ← ADD THIS
// app.use("/api/auth", authRoutes); 


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