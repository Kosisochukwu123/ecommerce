import express from "express";
import protect from "../middleware/auth.js";

const router = express.Router();

// In-memory storage for now (you can move to MongoDB later)
let contactSettings = {
  address: "123 Fashion Street, New York, NY 10001",
  instagram: "https://instagram.com/brandi",
  twitter: "https://twitter.com/brandi",
  customerSupport: "support@brandi.com",
  partnership: "collab@brandi.com",
  phone: "+1 (555) 123-4567"
};

// @route   GET /api/settings/contact
// @desc    Get contact settings (PUBLIC)
// @access  Public
router.get("/contact", (req, res) => {
  res.json({
    success: true,
    settings: contactSettings
  });
});

// @route   PUT /api/settings/contact
// @desc    Update contact settings (ADMIN ONLY)
// @access  Private/Admin
router.put("/contact", protect, (req, res) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only."
    });
  }

  const { address, instagram, twitter, customerSupport, partnership, phone } = req.body;

  // Update settings
  contactSettings = {
    address: address || contactSettings.address,
    instagram: instagram || contactSettings.instagram,
    twitter: twitter || contactSettings.twitter,
    customerSupport: customerSupport || contactSettings.customerSupport,
    partnership: partnership || contactSettings.partnership,
    phone: phone || contactSettings.phone
  };

  res.json({
    success: true,
    message: "Contact settings updated successfully",
    settings: contactSettings
  });
});

export default router;