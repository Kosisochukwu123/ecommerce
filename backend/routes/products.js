// const express = require("express");
// const router = express.Router();
// const getProductModel = require("../models/Product");

// const Product = () => getProductModel();


import express from "express";
import getProductModel from "../models/Product.js";

const router = express.Router();
const Product = () => getProductModel();

// GET /api/products - Get all products
router.get("/", async (req, res) => {
  try {
    const {
      category,
      search,
      page = 1,
      limit = 20,
      sort = "-createdAt",
      includeInactive = false,
    } = req.query;

    const filter = {};
    if (!includeInactive) filter.isActive = true;
    if (category) filter.category = category.toLowerCase();
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product().find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Product().countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/products/categories - Get all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Product().distinct("category", { isActive: true });
    res.json({ success: true, data: categories.sort() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/products/:id - Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product().findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/products - Create product (admin only)
router.post("/", async (req, res) => {
  try {
    const product = new (Product())(req.body);
    const saved = await product.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/products/:id - Update product (admin only)
router.put("/:id", async (req, res) => {
  try {
    const product = await Product().findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/products/:id/toggle - Activate/deactivate product
router.patch("/:id/toggle", async (req, res) => {
  try {
    const product = await Product().findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    product.isActive = !product.isActive;
    await product.save();
    res.json({
      success: true,
      message: `Product ${product.isActive ? "activated" : "deactivated"}`,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/products/:id - Delete product (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product().findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;