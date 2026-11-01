const express = require("express");
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Home route
app.get("/", (req, res) => {
  res.send("Smart Parking Finder Backend is Running!");
});

// Backend health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working"
  });
});
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

// Get all parking locations
app.get("/api/parking", (req, res) => {
  res.json({
    success: true,
    count: parkingLocations.length,
    data: parkingLocations
  });
});
// Demo payment status - NOT a real payment
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
    message:
      status === "success"
        ? "Test payment flow successful. No real money was transferred."
        : "Test payment failed. No booking confirmed."
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});