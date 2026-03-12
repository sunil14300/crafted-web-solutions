require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const workerRoutes = require("./routes/workers");
const bookingRoutes = require("./routes/bookings");
const adminRoutes = require("./routes/admin");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/bookings", bookingRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Seva API running on port ${PORT}`));
