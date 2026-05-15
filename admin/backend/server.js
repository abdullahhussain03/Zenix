require("dotenv").config();
const dns = require("dns");
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { getMongoUri } = require("./mongoUri");

const movieRoutes = require("./routes/movieRoutes");
const showRoutes = require("./routes/showRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const Movie = require("./models/Movie");
const Show = require("./models/Show");
const Booking = require("./models/Booking");

const app = express();
const PORT = process.env.PORT || 5000;

const FRONTEND_URL = process.env.FRONTEND_URL || "https://zenix-ten.vercel.app";
app.use(cors({
  origin: [FRONTEND_URL, "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/bookings", bookingRoutes);

async function seedFromFile() {
  const DATA_FILE = path.join(__dirname, "data", "movies.json");
  if (!fs.existsSync(DATA_FILE)) {
    console.log("No movies.json file found to import.");
    return 0;
  }
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) return 0;
  for (const row of parsed) {
    row.comments = row.comments || [];
    await Movie.create(row);
  }
  return parsed.length;
}

async function seedMoviesIfDbEmpty() {
  const existing = await Movie.countDocuments();
  if (existing > 0) return;
  console.log("No movies in database — importing sample data...");
  try {
    const count = await seedFromFile();
    console.log(`Successfully imported ${count} movies.`);
  } catch (err) {
    console.error("Error during seeding:", err.message);
  }
}

app.get("/api/reseed", async (req, res) => {
  try {
    await Movie.deleteMany({});
    await Show.deleteMany({});
    await Booking.deleteMany({});
    const count = await seedFromFile();
    res.json({ success: true, moviesImported: count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const mongoUri = getMongoUri();
const mongooseOpts = {
  serverSelectionTimeoutMS: 20000,
  family: 4,
};

mongoose
  .connect(mongoUri, mongooseOpts)
  .then(async () => {
    console.log("Connected to MongoDB");
    await seedMoviesIfDbEmpty();
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
