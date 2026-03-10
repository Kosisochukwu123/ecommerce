import express from "express";
import { body, validationResult } from "express-validator";
import getUserModel from "../models/user.js";
import getProductModel from "../models/Product.js";
import protect from "../middleware/auth.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// ============================================
// HELPER FUNCTIONS
// ============================================

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post(
  "/register",
  [
    body("username").trim().notEmpty().withMessage("Username is required")
      .isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { username, email, password, phone, firstName, lastName } = req.body;

    try {
      const User = getUserModel();

      // Check if user exists
      const userExists = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (userExists) {
        return res.status(400).json({
          success: false,
          message:
            userExists.email === email
              ? "Email already registered"
              : "Username already taken",
        });
      }

      // Check if phone exists (if provided)
      if (phone) {
        const phoneExists = await User.findOne({ phone });
        if (phoneExists) {
          return res.status(400).json({
            success: false,
            message: "Phone number already registered",
          });
        }
      }

      // Create user
      const user = await User.create({
        username,
        email,
        password,
        phone: phone || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during registration",
      });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login with email/phone and password
// @access  Public
router.post(
  "/login",
  [
    body("identifier").notEmpty().withMessage("Email or phone is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { identifier, password } = req.body;

    try {
      const User = getUserModel();

      // Find by email or phone using the static method
      const user = await User.findByEmailOrPhone(identifier).select("+password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account is deactivated",
        });
      }

      // Check password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = generateToken(user._id);

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during login",
      });
    }
  }
);

// @route   POST /api/auth/logout
// @desc    Logout user (invalidate token)
// @access  Private
router.post("/logout", protect, async (req, res) => {
  try {
    // You can implement token blacklisting here if needed
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        phone: req.user.phone,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        avatar: req.user.avatar,
        role: req.user.role,
        isEmailVerified: req.user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ============================================
// PASSWORD RESET ROUTES
// ============================================

// @route   POST /api/auth/forgot-password
// @desc    Send password reset code
// @access  Public
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const User = getUserModel();
    const user = await User.findOne({ email }).select(
      "+resetPasswordCode +resetPasswordExpires"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    // Generate reset code
    const resetCode = user.generatePasswordReset();
    await user.save();

    // TODO: Send email with code
    // await sendResetEmail(email, resetCode);

    console.log(`🔐 Reset code for ${email}: ${resetCode}`); // Remove in production

    res.json({
      success: true,
      message: "Reset code sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Error sending reset code",
    });
  }
});

// @route   POST /api/auth/verify-code
// @desc    Verify reset code
// @access  Public
router.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;

  try {
    const User = getUserModel();
    const user = await User.findOne({ email }).select(
      "+resetPasswordCode +resetPasswordExpires"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.resetPasswordCode !== code || !user.isPasswordResetValid()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired code",
      });
    }

    res.json({
      success: true,
      message: "Code verified",
    });
  } catch (error) {
    console.error("Verify code error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying code",
    });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with code
// @access  Public
router.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const User = getUserModel();
    const user = await User.findOne({ email }).select(
      "+resetPasswordCode +resetPasswordExpires"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.resetPasswordCode !== code || !user.isPasswordResetValid()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired code",
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    user.clearPasswordReset();
    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
    });
  }
});

// ============================================
// PROFILE MANAGEMENT ROUTES
// ============================================

// @route   GET /api/auth/profile
// @desc    Get full user profile
// @access  Private
router.get("/profile", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const user = await User.findById(req.user._id).select(
      "-password -activeToken"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
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

    res.json({
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
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change password
// @access  Private
router.post("/change-password", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if current password is correct
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   DELETE /api/auth/account
// @desc    Delete user account
// @access  Private
router.delete("/account", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password confirmation required",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    await User.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ============================================
// ADDRESS MANAGEMENT ROUTES
// ============================================

// @route   POST /api/auth/address
// @desc    Add new address
// @access  Private
router.post("/address", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
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
    console.error("Add address error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT /api/auth/address/:addressId
// @desc    Update address
// @access  Private
router.put("/address/:addressId", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
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

    res.json({
      success: true,
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   DELETE /api/auth/address/:addressId
// @desc    Delete address
// @access  Private
router.delete("/address/:addressId", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.addresses.pull(req.params.addressId);
    await user.save();

    res.json({
      success: true,
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ============================================
// WISHLIST ROUTES
// ============================================

// @route   GET /api/auth/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get("/wishlist", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const user = await User.findById(req.user._id).select("wishlist");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.wishlist || user.wishlist.length === 0) {
      return res.json({
        success: true,
        wishlist: [],
        count: 0,
      });
    }

    const Product = getProductModel();
    const products = await Product.find({
      _id: { $in: user.wishlist },
      isActive: true,
    });

    res.json({
      success: true,
      wishlist: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/auth/wishlist/:productId
// @desc    Add to wishlist
// @access  Private
router.post("/wishlist/:productId", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if already in wishlist
    if (user.wishlist.includes(req.params.productId)) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    user.wishlist.push(req.params.productId);
    await user.save();

    res.json({
      success: true,
      message: "Added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   DELETE /api/auth/wishlist/:productId
// @desc    Remove from wishlist
// @access  Private
router.delete("/wishlist/:productId", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.wishlist.pull(req.params.productId);
    await user.save();

    res.json({
      success: true,
      message: "Removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ============================================
// UTILITY ROUTES
// ============================================

// @route   POST /api/auth/check-email
// @desc    Check if email exists
// @access  Public
router.post("/check-email", async (req, res) => {
  try {
    const User = getUserModel();
    const exists = await User.findOne({ email: req.body.email });
    res.json({
      success: true,
      exists: !!exists,
    });
  } catch (error) {
    console.error("Check email error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking email",
    });
  }
});

// @route   POST /api/auth/check-username
// @desc    Check if username exists
// @access  Public
router.post("/check-username", async (req, res) => {
  try {
    const User = getUserModel();
    const exists = await User.findOne({ username: req.body.username });
    res.json({
      success: true,
      exists: !!exists,
    });
  } catch (error) {
    console.error("Check username error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking username",
    });
  }
});

// @route   POST /api/auth/check-phone
// @desc    Check if phone exists
// @access  Public
router.post("/check-phone", async (req, res) => {
  try {
    const User = getUserModel();
    const exists = await User.findOne({ phone: req.body.phone });
    res.json({
      success: true,
      exists: !!exists,
    });
  } catch (error) {
    console.error("Check phone error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking phone",
    });
  }
});

// ============================================
// ADMIN ROUTES
// ============================================

// @route   GET /api/auth/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get("/users", protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const User = getUserModel();

    // Get all users, exclude password and activeToken
    const users = await User.find({})
      .select("-password -activeToken")
      .sort({ createdAt: -1 }); // Newest first

    res.json({
      success: true,
      users: users,
      count: users.length,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT /api/auth/users/:userId/role
// @desc    Update user role (Admin only)
// @access  Private/Admin
router.put("/users/:userId/role", protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const User = getUserModel();
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'user' or 'admin'",
      });
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    res.json({
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
    console.error("Update role error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   DELETE /api/auth/users/:userId
// @desc    Delete user (Admin only)
// @access  Private/Admin
router.delete("/users/:userId", protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const User = getUserModel();
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    await User.findByIdAndDelete(req.params.userId);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ============================================
// ADMIN ROUTES
// ============================================

// @route   GET /api/users/all
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get("/all", protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const User = getUserModel();

    // Get all users, exclude password and activeToken
    const users = await User.find({})
      .select("-password -activeToken")
      .sort({ createdAt: -1 }); // Newest first

    res.json({
      success: true,
      users: users,
      count: users.length,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT /api/users/:userId/role
// @desc    Update user role (Admin only)
// @access  Private/Admin
router.put("/:userId/role", protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const User = getUserModel();
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'user' or 'admin'",
      });
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    res.json({
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
    console.error("Update role error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PATCH /api/users/:userId/toggle
// @desc    Toggle user active status (Admin only)
// @access  Private/Admin
router.patch("/:userId/toggle", protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const User = getUserModel();
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Toggle user status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   DELETE /api/users/:userId
// @desc    Delete user (Admin only)
// @access  Private/Admin
router.delete("/:userId", protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const User = getUserModel();
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    await User.findByIdAndDelete(req.params.userId);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/users/profile
// @desc    Get full user profile
// @access  Private
router.get("/profile", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const user = await User.findById(req.user._id).select("-password -activeToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
  try {
    const User = getUserModel();
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update allowed fields
    const allowedUpdates = ["firstName", "lastName", "phone", "dateOfBirth", "gender", "avatar"];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.json({
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
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/users/change-password
// @desc    Change password
// @access  Private
router.post("/change-password", protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide current and new password",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters",
    });
  }

  try {
    const User = getUserModel();
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;