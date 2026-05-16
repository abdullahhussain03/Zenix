const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const Movie = require("../models/Movie");
const Show = require("../models/Show");
const Booking = require("../models/Booking");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.fieldname === "trailer") {
      return {
        folder: "zenix/trailers",
        resource_type: "video",
        allowed_formats: ["mp4", "mov", "avi"],
      };
    }
    return {
      folder: "zenix/posters",
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    };
  },
});

const upload = multer({ storage });

const deleteFromCloudinary = async (url, resourceType = "image") => {
  if (!url) return;
  try {
    const parts = url.split("/");
    const folder = parts[parts.length - 2];
    const filename = parts[parts.length - 1].split(".")[0];
    const publicId = `${folder}/${filename}`;
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error("Cloudinary delete error:", err);
  }
};

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
    const posterUrl = req.files?.poster?.[0]?.path || null;
    const trailerUrl = req.files?.trailer?.[0]?.path || null;

    const newMovie = await Movie.create({
      id: uuidv4(),
      ...req.body,
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

    await deleteFromCloudinary(movie.poster, "image");
    await deleteFromCloudinary(movie.trailer, "video");

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

    const updates = { ...req.body };

    if (req.files?.poster?.[0]) {
      await deleteFromCloudinary(movie.poster, "image");
      updates.poster = req.files.poster[0].path;
    }

    if (req.files?.trailer?.[0]) {
      await deleteFromCloudinary(movie.trailer, "video");
      updates.trailer = req.files.trailer[0].path;
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

    movie.comments.push({ user: user || "Guest", text: text.trim() });
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
      return res.status(400).json({ message: "File too large." });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  next(err);
});

module.exports = router;