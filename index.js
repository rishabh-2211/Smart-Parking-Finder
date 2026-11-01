const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

// Allow frontend requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Serve website files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Demo parking data
const parkingLocations = [
  {
    id: 1,
    name: "City Centre Parking",
    area: "Chandigarh",
    totalSlots: 100,
    availableSlots: 25,
    pricePerHour: 30
  },
  {
    id: 2,
    name: "Hospital Parking",
    area: "Mohali",
    totalSlots: 80,
    availableSlots: 18,
    pricePerHour: 20
  },
  {
    id: 3,
    name: "College Parking",
    area: "Kharar",
    totalSlots: 60,
    availableSlots: 12,
    pricePerHour: 10
  }
];

// Backend health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working"
  });
});

// Get parking locations
app.get("/api/parking", (req, res) => {
  res.json({
    success: true,
    count: parkingLocations.length,
    data: parkingLocations
  });
});

// Demo payment only - no real money transferred
app.post("/api/test-payment", (req, res) => {
  const { amount, status } = req.body;

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Valid amount is required"
    });
  }

  if (status !== "success" && status !== "failed") {
    return res.status(400).json({
      success: false,
      message: "Use success or failed for testing"
    });
  }

  res.json({
    success: status === "success",
    paymentMode: "TEST_ONLY",
    amount,
    bookingConfirmed: false,
    message: status === "success"
      ? "Test payment successful. No real money transferred."
      : "Test payment failed. No booking confirmed."
  });
});

// Render provides PORT automatically
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Smart Parking Finder running on port ${PORT}`);
});