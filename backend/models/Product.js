// const mongoose = require("mongoose");
// const { getProductsDB } = require("../config/db");

import mongoose from "mongoose"
import {getProductsDB} from "../config/db.js"

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    rating: {
      stars: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    priceCents: {
      type: Number,
      required: true,
      min: 0,
    },
    discountCents: {
      type: Number,
      default: null,
      min: 0,
    },
    keywords: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    brand: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Helper to get formatted price
productSchema.virtual("price").get(function () {
  return (this.priceCents / 100).toFixed(2);
});

productSchema.virtual("onSale").get(function () {
  return this.discountCents !== null && this.discountCents < this.priceCents;
});

productSchema.set("toJSON", { virtuals: true });

// Connect this model to the PRODUCTS database
const getProductModel = () => {
  const db = getProductsDB();
  if (db.models.Product) return db.models.Product;
  return db.model("Product", productSchema);
};

export default  getProductModel;