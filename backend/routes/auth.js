import express from "express";
import getUserModel from "../models/user.js";
import protect from "../middleware/auth.js";
import getProductModel from "../models/Product.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// POST /api/users/register
router.post("/register", async (req, res) => {
  try {
    const User = getUserModel(); // Call it HERE
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const userExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (usernameExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    const User = getUserModel(); // Call it HERE
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const user = await User.findOne({ email }).select("+password"); // Need to select password explicitly

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/users/me
router.get("/me", protect, async (req, res) => {
  try {
    console.log("✅ /me route hit for user:", req.user._id);

    res.status(200).json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      phone: req.user.phone,
      avatar: req.user.avatar,
    });
  } catch (error) {
    console.error("❌ /me route error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// GET /api/users/profile - Get full user profile
router.get("/profile", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const user = await User.findById(req.user._id).select(
      "-password -activeToken",
    );
    // .populate("wishlist");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/users/profile - Update user profile
router.put("/profile", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update allowed fields
    const allowedUpdates = [
      "firstName",
      "lastName",
      "phone",
      "dateOfBirth",
      "gender",
      "avatar",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/users/change-password - Change password
router.put("/change-password", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Please provide current and new password",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if current password is correct
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/users/address - Add new address
router.post("/address", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { type, street, city, state, zipCode, country, isDefault } = req.body;

    // If this is set as default, unset all other defaults
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      type,
      street,
      city,
      state,
      zipCode,
      country,
      isDefault,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/users/address/:addressId - Update address
router.put("/address/:addressId", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // If setting as default, unset all others
    if (req.body.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // Update address fields
    Object.keys(req.body).forEach((key) => {
      address[key] = req.body[key];
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/users/address/:addressId - Delete address
router.delete("/address/:addressId", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.addresses.pull(req.params.addressId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/users/wishlist
router.get("/wishlist", protect, async (req, res) => {
  console.log("=== WISHLIST ROUTE START ===");

  try {
    console.log("1️⃣ Getting user model...");
    const User = getUserModel();
    console.log("✅ User model loaded");

    console.log("2️⃣ Finding user by ID:", req.user._id);
    const user = await User.findById(req.user._id).select("wishlist");
    console.log("✅ User found:", !!user);

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("3️⃣ User wishlist IDs:", user.wishlist);

    if (!user.wishlist || user.wishlist.length === 0) {
      console.log("ℹ️ Wishlist is empty");
      return res.status(200).json({
        success: true,
        wishlist: [],
        count: 0,
      });
    }

    console.log("4️⃣ Getting Product model...");
    const Product = getProductModel();
    console.log("✅ Product model type:", typeof Product);
    console.log("✅ Product.find type:", typeof Product.find);

    console.log("5️⃣ Fetching products from DB...");
    const products = await Product.find({
      _id: { $in: user.wishlist },
      isActive: true,
    });
    console.log("✅ Found products:", products.length);

    res.status(200).json({
      success: true,
      wishlist: products,
      count: products.length,
    });

    console.log("=== WISHLIST ROUTE SUCCESS ===");
  } catch (error) {
    console.error("=== WISHLIST ROUTE ERROR ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// POST /api/users/wishlist/:productId - Add to wishlist
router.post("/wishlist/:productId", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already in wishlist
    if (user.wishlist.includes(req.params.productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(req.params.productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/users/wishlist/:productId - Remove from wishlist
router.delete("/wishlist/:productId", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist.pull(req.params.productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


// GET /api/users/all - Get all users (Admin only)
router.get("/all", protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false,
        message: "Access denied. Admin only." 
      });
    }

    const User = getUserModel();
    
    // Get all users, exclude password and activeToken
    const users = await User.find({})
      .select("-password -activeToken")
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      users: users,
      count: users.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

// PUT /api/users/:userId/role - Update user role (Admin only)
router.put("/:userId/role", protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false,
        message: "Access denied. Admin only." 
      });
    }

    const User = getUserModel();
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid role. Must be 'user' or 'admin'" 
      });
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

// DELETE /api/users/:userId - Delete user (Admin only)
router.delete("/:userId", protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false,
        message: "Access denied. Admin only." 
      });
    }

    const User = getUserModel();
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ 
        success: false,
        message: "You cannot delete your own account" 
      });
    }

    await User.findByIdAndDelete(req.params.userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});


export default router;
