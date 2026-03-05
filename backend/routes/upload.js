import express from "express";
import cloudinary from "../config/cloudinary.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// POST /api/upload/image - Upload image to Cloudinary
router.post("/image", protect, async (req, res) => {
  try {
    console.log("📸 Upload route hit");
    console.log("User:", req.user?.username, "Role:", req.user?.role);

    // ← REMOVE ADMIN CHECK - Allow all authenticated users
    // Anyone logged in can upload images (for products, submissions, etc.)

    const { image } = req.body;

    if (!image) {
      console.log("❌ No image provided");
      return res.status(400).json({
        success: false,
        message: "No image provided",
      });
    }

    console.log("📤 Uploading to Cloudinary...");
    console.log("Image data length:", image.length);

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "ecommerce-products",
      resource_type: "auto",
    });

    console.log("✅ Upload successful:", uploadResponse.secure_url);

    res.status(200).json({
      success: true,
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (error) {
    console.error("❌ Image upload error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
});

// DELETE /api/upload/image/:publicId - Delete image from Cloudinary (Admin only)
router.delete("/image/:publicId", protect, async (req, res) => {
  try {
    // Keep admin check for deletion
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const publicId = req.params.publicId.replace(/--/g, "/");

    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Image delete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete image",
    });
  }
});

export default router;