const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Worker = require("../models/Worker");

const router = express.Router();

// POST /api/auth/register
router.post(
  "/register",
  [
    body("name").trim().notEmpty().isLength({ max: 100 }),
    body("address").trim().notEmpty().isLength({ max: 300 }),
    body("dob").isISO8601(),
    body("mobile").trim().notEmpty().isLength({ min: 10, max: 15 }),
    body("email").optional({ checkFalsy: true }).isEmail().normalizeEmail(),
    body("state").trim().notEmpty(),
    body("occupation").trim().notEmpty(),
    body("aadhaar").trim().notEmpty().isLength({ min: 12, max: 12 }),
    body("pan").optional({ checkFalsy: true }).isLength({ min: 10, max: 10 }),
    body("priceCharge").trim().notEmpty(),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const registrationId = "SEVA" + Math.floor(100000 + Math.random() * 900000);
      const passwordHash = await bcrypt.hash(req.body.password, 10);

      const worker = await Worker.create({
        ...req.body,
        registrationId,
        passwordHash,
      });

      const token = jwt.sign(
        { id: worker._id, registrationId: worker.registrationId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(201).json({ registrationId: worker.registrationId, token });
    } catch (error) {
      if (error.code === 11000) return res.status(409).json({ error: "Duplicate entry." });
      res.status(500).json({ error: "Server error." });
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("registrationId").trim().notEmpty(),
    body("dob").isISO8601(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const worker = await Worker.findOne({ registrationId: req.body.registrationId });
      if (!worker) return res.status(404).json({ error: "Worker not found." });

      const dobMatch =
        new Date(worker.dob).toISOString().slice(0, 10) === req.body.dob;
      if (!dobMatch) return res.status(401).json({ error: "Invalid credentials." });

      const token = jwt.sign(
        { id: worker._id, registrationId: worker.registrationId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({ token, worker: { registrationId: worker.registrationId, name: worker.name, occupation: worker.occupation } });
    } catch {
      res.status(500).json({ error: "Server error." });
    }
  }
);

module.exports = router;
