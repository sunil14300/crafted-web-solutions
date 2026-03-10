const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    registrationId: { type: String, unique: true, required: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    dob: { type: Date, required: true },
    mobile: { type: String, required: true },
    email: { type: String, trim: true, lowercase: true },
    state: { type: String, required: true },
    occupation: {
      type: String,
      required: true,
      enum: [
        "Plumber", "Electrician", "Painter", "Mechanic", "Cook",
        "Carpenter", "Barber", "Sweeper", "Mason", "Driver",
        "Helper", "Cobbler", "Technical Person", "Labour",
      ],
    },
    aadhaar: { type: String, required: true },
    pan: { type: String },
    priceCharge: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

workerSchema.index({ occupation: 1, state: 1, available: 1 });
workerSchema.index({ name: "text", occupation: "text", address: "text" });

module.exports = mongoose.model("Worker", workerSchema);
