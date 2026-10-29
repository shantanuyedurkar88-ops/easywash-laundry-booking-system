const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/easywash")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Error:", err.message));

const Booking = mongoose.model(
  "Booking",
  new mongoose.Schema({
    name: { type: String, required: true },
    clothes: { type: Number, required: true },
    service: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, default: "Pending" },
  })
);

app.post("/api/bookings", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ _id: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});