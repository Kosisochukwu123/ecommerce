import express from "express";
import getOrderModel from "../models/Order.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// POST /api/orders - Create new order
router.post("/", protect, async (req, res) => {
  try {
    const Order = getOrderModel();
    const { items, totalCents, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Order must have at least one item" 
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      totalCents,
      shippingAddress,
      paymentMethod,
      paymentStatus: "pending",
    });

    res.status(201).json({
      success: true,
      order,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});


// GET /api/orders - Get all orders (Admin) or user's orders
router.get("/", protect, async (req, res) => {
  try {
    const Order = getOrderModel();
    let query = {};

    // If not admin, only show user's own orders
    if (req.user.role !== "admin") {
      query.user = req.user._id;
    }

    const orders = await Order.find(query)
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

// GET /api/orders/:id - Get single order
router.get("/:id", protect, async (req, res) => {
  try {
    const Order = getOrderModel();
    const order = await Order.findById(req.params.id)
      .populate("user", "username email");

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false,
        message: "Access denied" 
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

// PUT /api/orders/:id/status - Update order status (Admin only)
router.put("/:id/status", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false,
        message: "Access denied. Admin only." 
      });
    }

    const Order = getOrderModel();
    const { status } = req.body;

    if (!["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid status" 
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      order,
      message: "Order status updated",
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

// GET /api/orders/stats/overview - Get order statistics (Admin only)
router.get("/stats/overview", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false,
        message: "Access denied. Admin only." 
      });
    }

    const Order = getOrderModel();

    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const processingOrders = await Order.countDocuments({ status: "processing" });
    const shippedOrders = await Order.countDocuments({ status: "shipped" });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });
    const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalCents" } } },
    ]);
    const totalRevenueCents = revenueResult[0]?.total || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenueCents,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

export default router;