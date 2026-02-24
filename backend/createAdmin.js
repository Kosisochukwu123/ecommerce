import "dotenv/config";
import mongoose from "mongoose";
import { connectUsersDB } from "./config/db.js";
import getUserModel from "./models/User.js";

const createAdmin = async () => {
  try {
    await connectUsersDB();
    
    const User = getUserModel(); // Get the model

    // Create admin user
    const admin = await User.create({
      username: "admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin"
    });

    console.log("✅ Admin created successfully!");
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Role:     ${admin.role}`);
    console.log("\n⚠️  IMPORTANT: Login with these credentials and change the password!");
    console.log(`   Email:    admin@example.com`);
    console.log(`   Password: admin123\n`);
    
  } catch (error) {
    if (error.code === 11000) {
      console.error("❌ Admin user already exists!");
    } else {
      console.error("❌ Error:", error.message);
    }
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from database");
    process.exit(0);
  }
};

createAdmin();