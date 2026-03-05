import mongoose from "mongoose";
import { getUsersDB } from "../config/db.js";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: String, // Product ID as string (since products are in different DB)
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productImage: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  priceCents: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "cash"],
      default: "card",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    subtotalCents: {
      type: Number,
      required: true,
    },
    shippingCents: {
      type: Number,
      default: 0,
    },
    taxCents: {
      type: Number,
      default: 0,
    },
    totalCents: {
      type: Number,
      required: true,
    },
    notes: String,
    trackingNumber: String,
    deliveredAt: Date,
  },
  { timestamps: true }
);

// Generate order number
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

const getOrderModel = () => {
  const db = getUsersDB();
  
  if (!db) {
    throw new Error("Users database not connected");
  }
  
  if (db.models.Order) return db.models.Order;
  return db.model("Order", orderSchema);
};

export default getOrderModel;