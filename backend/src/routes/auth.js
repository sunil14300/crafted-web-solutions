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
    body("role").isIn(["worker", "customer"]),
    body("password").isLength({ min: 6 }),
    // Worker-only validations
    body("occupation").if(body("role").equals("worker")).trim().notEmpty(),
    body("aadhaar").if(body("role").equals("worker")).trim().notEmpty().isLength({ min: 12, max: 12 }),
    body("pan").optional({ checkFalsy: true }).isLength({ min: 10, max: 10 }),
    body("priceCharge").if(body("role").equals("worker")).trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const prefix = req.body.role === "customer" ? "CUST" : "SEVA";
      const registrationId = prefix + Math.floor(100000 + Math.random() * 900000);
      const passwordHash = await bcrypt.hash(req.body.password, 10);

      const userData = {
        registrationId,
        passwordHash,
        name: req.body.name,
        address: req.body.address,
        dob: req.body.dob,
        mobile: req.body.mobile,
        email: req.body.email,
        state: req.body.state,
        role: req.body.role,
      };

      if (req.body.role === "worker") {
        userData.occupation = req.body.occupation;
        userData.aadhaar = req.body.aadhaar;
        userData.pan = req.body.pan;
        userData.priceCharge = req.body.priceCharge;
      }

      const worker = await Worker.create(userData);

      const token = jwt.sign(
        { id: worker._id, registrationId: worker.registrationId, role: worker.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(201).json({
        registrationId: worker.registrationId,
        token,
        user: { registrationId: worker.registrationId, name: worker.name, role: worker.role, occupation: worker.occupation },
      });
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
      const user = await Worker.findOne({ registrationId: req.body.registrationId });
      if (!user) return res.status(404).json({ error: "User not found." });

      const dobMatch =
        new Date(user.dob).toISOString().slice(0, 10) === req.body.dob;
      if (!dobMatch) return res.status(401).json({ error: "Invalid credentials." });

      const token = jwt.sign(
        { id: user._id, registrationId: user.registrationId, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        token,
        user: {
          registrationId: user.registrationId,
          name: user.name,
          role: user.role,
          occupation: user.occupation,
          verified: user.verified,
        },
      });
    } catch {
      res.status(500).json({ error: "Server error." });
    }
  }
);

module.exports = router;
