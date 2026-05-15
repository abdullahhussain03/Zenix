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

async function seedMoviesIfDbEmpty() {
  const existing = await Movie.countDocuments();
  if (existing > 0) return;

  console.log("No movies in database — importing sample data...");
  const DATA_FILE = path.join(__dirname, "data", "movies.json");

  if (!fs.existsSync(DATA_FILE)) {
    console.log("No movies.json file found to import.");
    return;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;

    for (const row of parsed) {
      row.comments = row.comments || [];
      await Movie.create(row);
    }
    console.log(`Successfully imported ${parsed.length} movies.`);
  } catch (err) {
    console.error("Error during seeding:", err.message);
  }
}

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
