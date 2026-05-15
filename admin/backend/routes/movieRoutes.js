const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const Movie = require("../models/Movie");
const Show = require("../models/Show");
const Booking = require("../models/Booking");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 100 * 1024 * 1024 }
});

router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.json(movies.map(m => m.toJSON()));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", upload.fields([
  { name: "poster", maxCount: 1 },
  { name: "trailer", maxCount: 1 }
]), async (req, res) => {
  try {
    const body = req.body;
    let posterUrl = req.files?.poster ? `/uploads/${req.files.poster[0].filename}` : null;
    let trailerUrl = req.files?.trailer ? `/uploads/${req.files.trailer[0].filename}` : null;

    const newMovie = await Movie.create({
      id: uuidv4(),
      ...body,
      poster: posterUrl,
      trailer: trailerUrl,
      comments: []
    });

    res.json({ success: true, movie: newMovie.toJSON() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not create movie" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const requestedId = req.params.id;
    let movie = await Movie.findOne({ id: requestedId });

    if (!movie) {
      const mongoose = require("mongoose");
      if (mongoose.Types.ObjectId.isValid(requestedId)) {
        movie = await Movie.findById(requestedId);
      }
    }

    if (movie) {
      res.json(movie.toJSON());
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findOne({ id: req.params.id });
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    [movie.poster, movie.trailer].forEach(filePath => {
      if (filePath) {
        const fullPath = path.join(__dirname, '..', filePath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
    });

    await Booking.deleteMany({ movieId: movie.id });
    await Show.deleteMany({ movieId: movie.id });
    await Movie.deleteOne({ id: req.params.id });

    res.json({ success: true, message: "Movie deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete movie" });
  }
});

router.put("/:id", upload.fields([
  { name: "poster", maxCount: 1 },
  { name: "trailer", maxCount: 1 }
]), async (req, res) => {
  try {
    const movie = await Movie.findOne({ id: req.params.id });
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const body = req.body;
    const updates = { ...body };

    if (req.files?.poster) {
      if (movie.poster) {
        const oldPath = path.join(__dirname, '..', movie.poster);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updates.poster = `/uploads/${req.files.poster[0].filename}`;
    }

    if (req.files?.trailer) {
      if (movie.trailer) {
        const oldPath = path.join(__dirname, '..', movie.trailer);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updates.trailer = `/uploads/${req.files.trailer[0].filename}`;
    }

    const updated = await Movie.findOneAndUpdate(
      { id: req.params.id },
      { $set: updates },
      { new: true }
    );

    res.json({ success: true, movie: updated.toJSON() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update movie" });
  }
});

router.post("/:id/comments", async (req, res) => {
  try {
    const { user, text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const movie = await Movie.findOne({ id: req.params.id });
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    movie.comments.push({
      user: user || "Guest",
      text: text.trim()
    });

    await movie.save();
    res.json({ success: true, comments: movie.comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not save comment" });
  }
});

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large. Maximum size is 100MB." });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  next(err);
});

module.exports = router;