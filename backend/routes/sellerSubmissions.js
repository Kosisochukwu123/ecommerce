import express from "express";
import getSellerSubmissionModel from "../models/SellerSubmission.js";
import getProductModel from "../models/Product.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// POST /api/seller-submissions - Submit product for review
router.post("/", protect, async (req, res) => {
  try {
    console.log("📦 New seller submission from:", req.user.username);

    const {
      name,
      category,
      priceCents,
      image,
      description,
      stock,
      brand,
      condition,
    } = req.body;

    // Validate required fields
    if (!name || !category || !priceCents || !image || !description || !condition) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const SellerSubmission = getSellerSubmissionModel();

    const submission = await SellerSubmission.create({
      seller: req.user._id,
      sellerName: req.user.username,
      sellerEmail: req.user.email,
      name,
      category,
      priceCents,
      image,
      description,
      stock: stock || 1,
      brand: brand || "",
      condition,
      status: "pending",
    });

    console.log("✅ Submission created:", submission._id);

    res.status(201).json({
      success: true,
      message: "Product submitted for review! We'll notify you once it's reviewed.",
      submission,
    });
  } catch (error) {
    console.error("❌ Submission error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit product",
      error: error.message,
    });
  }
});

// GET /api/seller-submissions/my-submissions - Get user's submissions
router.get("/my-submissions", protect, async (req, res) => {
  try {
    const SellerSubmission = getSellerSubmissionModel();

    const submissions = await SellerSubmission.find({
      seller: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("❌ Get submissions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get submissions",
    });
  }
});

// GET /api/seller-submissions - Get all submissions (Admin only)
router.get("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const { status } = req.query;
    const SellerSubmission = getSellerSubmissionModel();

    const query = status && status !== "all" ? { status } : {};
    const submissions = await SellerSubmission.find(query).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("❌ Get all submissions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get submissions",
    });
  }
});

// PUT /api/seller-submissions/:id/approve - Approve submission (Admin only)
router.put("/:id/approve", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    console.log("✅ Approving submission:", req.params.id);

    const SellerSubmission = getSellerSubmissionModel();
    const submission = await SellerSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    if (submission.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Submission already reviewed",
      });
    }

    // Create product in Products DB
    const Product = getProductModel();
    const product = await Product.create({
      name: submission.name,
      category: submission.category,
      priceCents: submission.priceCents,
      image: submission.image,
      description: submission.description,
      stock: submission.stock,
      brand: submission.brand,
      isActive: true,
    });

    // Update submission
    submission.status = "approved";
    submission.productId = product._id.toString();
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = new Date();
    submission.adminNotes = req.body.notes || "Approved";
    await submission.save();

    console.log("✅ Product created:", product._id);

    res.status(200).json({
      success: true,
      message: "Submission approved and product created",
      submission,
      product,
    });
  } catch (error) {
    console.error("❌ Approve error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve submission",
      error: error.message,
    });
  }
});

// PUT /api/seller-submissions/:id/reject - Reject submission (Admin only)
router.put("/:id/reject", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    console.log("❌ Rejecting submission:", req.params.id);

    const SellerSubmission = getSellerSubmissionModel();
    const submission = await SellerSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    if (submission.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Submission already reviewed",
      });
    }

    submission.status = "rejected";
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = new Date();
    submission.adminNotes = req.body.reason || "Does not meet our guidelines";
    await submission.save();

    res.status(200).json({
      success: true,
      message: "Submission rejected",
      submission,
    });
  } catch (error) {
    console.error("❌ Reject error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject submission",
    });
  }
});

// DELETE /api/seller-submissions/:id - Delete submission
router.delete("/:id", protect, async (req, res) => {
  try {
    const SellerSubmission = getSellerSubmissionModel();
    const submission = await SellerSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    // Check if user owns submission or is admin
    if (
      submission.seller.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await submission.deleteOne();

    res.status(200).json({
      success: true,
      message: "Submission deleted",
    });
  } catch (error) {
    console.error("❌ Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete submission",
    });
  }
});

export default router;