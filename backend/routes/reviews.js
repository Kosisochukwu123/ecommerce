import express from "express";
import getProductModel from "../models/Product.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// POST /api/products/:productId/reviews - Add review
router.post("/:productId/reviews", protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    console.log("📝 Adding review to product:", productId);
    console.log("User:", req.user.username);
    console.log("Rating:", rating, "Comment:", comment);

    // Validate input
    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide both rating and comment",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const Product = getProductModel();
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Add review
    const review = {
      user: req.user._id,
      username: req.user.username,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    // Update product rating
    product.rating.count = product.reviews.length;
    product.rating.stars =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    console.log("✅ Review added successfully");

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
      rating: product.rating,
    });
  } catch (error) {
    console.error("❌ Add review error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// GET /api/products/:productId/reviews - Get all reviews for a product
router.get("/:productId/reviews", async (req, res) => {
  try {
    const { productId } = req.params;

    const Product = getProductModel();
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
      rating: product.rating,
    });
  } catch (error) {
    console.error("❌ Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// DELETE /api/products/:productId/reviews/:reviewId - Delete review
router.delete("/:productId/reviews/:reviewId", protect, async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const Product = getProductModel();
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const review = product.reviews.id(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if user owns the review or is admin
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    product.reviews.pull(reviewId);

    // Recalculate rating
    if (product.reviews.length > 0) {
      product.rating.count = product.reviews.length;
      product.rating.stars =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    } else {
      product.rating.count = 0;
      product.rating.stars = 0;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete review error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;