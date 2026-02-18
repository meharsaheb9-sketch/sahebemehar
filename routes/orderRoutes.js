const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Helper to subtract days
const subtractDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
};

// ➕ Add Order
router.post("/", async (req, res) => {
  try {
    const { phone, price, endDate } = req.body;

    const lastOrder = await Order.findOne().sort({ serialNo: -1 });
    const serialNo = lastOrder ? lastOrder.serialNo + 1 : 1;

    const end = new Date(endDate);

    const newOrder = new Order({
      serialNo,
      phone,
      price,
      endDate: end,
      tasks: {
        cutting: { date: subtractDays(end, 4) },
        stitching: { date: subtractDays(end, 3) },
        fitCheck: { date: subtractDays(end, 2) },
        tirpai: { date: subtractDays(end, 1) },
        ready: { date: end }
      }
    });

    await newOrder.save();
    res.json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📥 Get Orders FIFO
router.get("/", async (req, res) => {
  const orders = await Order.find().sort({ serialNo: 1 });
  res.json(orders);
});

// ✅ Complete Task
router.patch("/:id/task/:taskName", async (req, res) => {
  const { id, taskName } = req.params;

  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ error: "Order not found" });

  if (!order.tasks[taskName])
    return res.status(400).json({ error: "Invalid task" });

  order.tasks[taskName].completed = true;

  await order.save();
  res.json(order);
});

// ❌ Cancel Order
router.patch("/:id/cancel", async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });

  order.cancelled = true;
  await order.save();
  res.json(order);
});

// 🗑 Delete Order
router.delete("/:id", async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

module.exports = router;
