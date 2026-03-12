const express = require("express");
const auth = require("../middleware/auth");
const Worker = require("../models/Worker");
const Booking = require("../models/Booking");

const router = express.Router();

// Admin middleware
const adminOnly = async (req, res, next) => {
  try {
    const user = await Worker.findById(req.worker.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required." });
    }
    next();
  } catch {
    res.status(500).json({ error: "Server error." });
  }
};

// GET /api/admin/users — list all users
router.get("/users", auth, adminOnly, async (req, res) => {
  try {
    const { role, verified } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (verified !== undefined) filter.verified = verified === "true";
    const users = await Worker.find(filter).select("-passwordHash").sort({ createdAt: -1 });
    res.json({ users, total: users.length });
  } catch {
    res.status(500).json({ error: "Server error." });
  }
});

// GET /api/admin/users/:id — single user detail
router.get("/users/:id", auth, adminOnly, async (req, res) => {
  try {
    const user = await Worker.findById(req.params.id).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json(user);
  } catch {
    res.status(500).json({ error: "Server error." });
  }
});

// PATCH /api/admin/users/:id — update user (verify, edit)
router.patch("/users/:id", auth, adminOnly, async (req, res) => {
  try {
    const allowed = ["verified", "name", "address", "mobile", "email", "state", "occupation", "priceCharge", "available", "role"];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    const user = await Worker.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json(user);
  } catch {
    res.status(500).json({ error: "Server error." });
  }
});

// DELETE /api/admin/users/:id — delete user
router.delete("/users/:id", auth, adminOnly, async (req, res) => {
  try {
    const user = await Worker.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({ message: "User deleted." });
  } catch {
    res.status(500).json({ error: "Server error." });
  }
});

// GET /api/admin/bookings — all bookings
router.get("/bookings", auth, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find().populate("workerId", "name registrationId occupation").sort({ createdAt: -1 });
    res.json({ bookings, total: bookings.length });
  } catch {
    res.status(500).json({ error: "Server error." });
  }
});

// PATCH /api/admin/bookings/:id — update booking status
router.patch("/bookings/:id", auth, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!booking) return res.status(404).json({ error: "Booking not found." });
    res.json(booking);
  } catch {
    res.status(500).json({ error: "Server error." });
  }
});

// DELETE /api/admin/bookings/:id
router.delete("/bookings/:id", auth, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found." });
    res.json({ message: "Booking deleted." });
  } catch {
    res.status(500).json({ error: "Server error." });
  }
});

// GET /api/admin/stats
router.get("/stats", auth, adminOnly, async (req, res) => {
  try {
    const [totalWorkers, totalCustomers, totalBookings, pendingVerifications] = await Promise.all([
      Worker.countDocuments({ role: "worker" }),
      Worker.countDocuments({ role: "customer" }),
      Booking.countDocuments(),
      Worker.countDocuments({ verified: false }),
    ]);
    res.json({ totalWorkers, totalCustomers, totalBookings, pendingVerifications });
  } catch {
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
