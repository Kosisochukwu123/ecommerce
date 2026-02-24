import express from "express";
import getUserModel from "../models/user.js";  // Capital U to match filename
import protect from "../middleware/auth.js";
import getProductModel from "../models/Product.js";  // ← ADD THIS
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
// router.get("/me", protect, async (req, res) => {
//   res.status(200).json(req.user);

// });


// GET /api/users/profile - Get full user profile
router.get("/profile", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const user = await User.findById(req.user._id)
      .select("-password -activeToken")
      // .populate("wishlist");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
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
        message: "Please provide current and new password" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "New password must be at least 6 characters" 
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

// GET /api/users/wishlist - Get user's wishlist with product details
router.get("/wishlist", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const Product = getProductModel(); // Import from products DB
    
    const user = await User.findById(req.user._id).select("wishlist");
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Manually fetch products from the products DB
    const products = await Product().find({
      _id: { $in: user.wishlist }
    });

    res.status(200).json({
      success: true,
      wishlist: products,
    });
  } catch (error) {
    console.error("Wishlist route error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
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

export default router;