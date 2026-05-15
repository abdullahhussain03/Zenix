const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const Booking = require("../models/Booking");
const Show = require("../models/Show");

router.get("/", async (req, res) => {
  try {
    // Sort by newest first
    const list = await Booking.find({}).sort({ createdAt: -1 });
    // Convert to JSON array
    res.json(list.map(b => b.toJSON()));
  } catch (error) {
    console.error("Booking List Error:", error);
    res.status(500).json({ message: "Server error fetching bookings" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { showId, userName, userEmail, userPhone, seats, amount, movieId, movieTitle } = req.body;

    if (!showId || !userName || !Array.isArray(seats)) {
      return res.status(400).json({ message: "Missing or invalid booking data" });
    }

    if (seats.length === 0) {
      return res.status(400).json({ message: "Please select at least one seat" });
    }

    const show = await Show.findOne({ id: showId });
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    const occupied = show.occupiedSeats || [];
    const conflict = seats.find(seat => occupied.includes(seat));

    if (conflict) {
      return res.status(400).json({ message: `Seat already booked: ${conflict}` });
    }

    show.occupiedSeats.push(...seats);
    await show.save();

    const finalAmount = typeof amount === "number" ? amount : Number(amount) || 0;
    const seatsText = seats.join(", ");

    const bookingDoc = await Booking.create({
      id: uuidv4(),
      showId: show.id,
      movieId: movieId || show.movieId,
      movieTitle: movieTitle || show.movieTitle,
      userName,
      userEmail: userEmail || "",
      userPhone: userPhone || "",
      seats: seatsText,
      hall: show.hall,
      date: show.date,
      time: show.time,
      status: "Confirmed",
      amount: finalAmount
    });

    res.json({ success: true, booking: bookingDoc.toJSON() });
  } catch (error) {
    console.error("Booking Creation Error:", error);
    res.status(500).json({ message: "Internal server error during booking" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // 1. Find the booking
    const booking = await Booking.findOne({ id: req.params.id });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const show = await Show.findOne({ id: booking.showId });
    if (show && booking.seats) {
      const seatsToRelease = booking.seats.split(",").map(s => s.trim());
      
      show.occupiedSeats = show.occupiedSeats.filter(
        seat => !seatsToRelease.includes(seat)
      );
      
      await show.save();
    }

    await Booking.deleteOne({ id: req.params.id });
    res.json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Booking Cancellation Error:", error);
    res.status(500).json({ message: "Could not cancel booking" });
  }
});

module.exports = router;
