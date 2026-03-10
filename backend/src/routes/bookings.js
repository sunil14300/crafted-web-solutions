const express = require("express");
const { body, validationResult } = require("express-validator");
const Booking = require("../models/Booking");
const Worker = require("../models/Worker");
const auth = require("../middleware/auth");

const router = express.Router();

const COMMISSION_RATE = 0.07; // 7%

// POST /api/bookings
router.post(
  "/",
  [
    body("workerId").trim().notEmpty(),
    body("customerName").trim().notEmpty().isLength({ max: 100 }),
    body("customerMobile").trim().notEmpty().isLength({ min: 10, max: 15 }),
    body("customerAddress").trim().notEmpty().isLength({ max: 300 }),
    body("serviceDate").isISO8601(),
    body("agreedPrice").isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const worker = await Worker.findOne({ registrationId: req.body.workerId });
      if (!worker) return res.status(404).json({ error: "Worker not found." });
      if (!worker.available) return res.status(400).json({ error: "Worker is not available." });

      const commission = parseFloat(req.body.agreedPrice) * COMMISSION_RATE;

      const booking = await Booking.create({
        workerId: worker._id,
        customerName: req.body.customerName,
        customerMobile: req.body.customerMobile,
        customerAddress: req.body.customerAddress,
        serviceDate: req.body.serviceDate,
        description: req.body.description,
        agreedPrice: req.body.agreedPrice,
        commission,
      });

      res.status(201).json(booking);
    } catch {
      res.status(500).json({ error: "Server error." });
    }
  }
);

// GET /api/bookings/my — worker's own bookings (authenticated)
router.get("/my", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ workerId: req.worker.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch {
    res.status(500).json({ error: "Server error." });
  }
});

// PATCH /api/bookings/:id/status (authenticated worker)
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, workerId: req.worker.id },
      { status: req.body.status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: "Booking not found." });
    res.json(booking);
  } catch {
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
