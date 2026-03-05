import mongoose from "mongoose";
import { getUsersDB } from "../config/db.js";

const sellerSubmissionSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    sellerName: {
      type: String,
      required: true,
    },
    sellerEmail: {
      type: String,
      required: true,
    },
    // Product Details
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    priceCents: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 1,
    },
    brand: {
      type: String,
      default: "",
    },
    condition: {
      type: String,
      enum: ["New", "Like New", "Good", "Fair", "Used"],
      required: true,
    },
    // Submission Status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNotes: {
      type: String,
      default: "",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    // Created Product Reference (if approved)
    productId: {
      type: String,
    },
  },
  { timestamps: true }
);

const getSellerSubmissionModel = () => {
  const db = getUsersDB();

  if (!db) {
    throw new Error("Users database not connected");
  }

  if (db.models.SellerSubmission) return db.models.SellerSubmission;
  return db.model("SellerSubmission", sellerSubmissionSchema);
};

export default getSellerSubmissionModel;