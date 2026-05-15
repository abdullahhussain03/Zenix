const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")

const Show = require("../models/Show")

router.get("/detail/:showId", async (req, res) => {
  try {
    const show = await Show.findOne({ id: req.params.showId })
    if (!show) {
      return res.status(404).json({ message: "Show not found" })
    }
    res.json(show.toJSON())
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/", async (req, res) => {
  try {
    const movieId = req.query.movieId
    let found = []

    if (movieId && movieId.length > 0) {
      found = await Show.find({ movieId })
    } else {
      found = await Show.find({})
    }

    const shows = []
    for (let i = 0; i < found.length; i++) {
      shows.push(found[i].toJSON())
    }

    shows.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date)
      }
      return a.time.localeCompare(b.time)
    })

    res.json(shows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

router.post("/", async (req, res) => {
  try {
    const body = req.body

    if (!body.movieId || !body.date || !body.time) {
      return res.status(400).json({ message: "Missing fields" })
    }

    const newShow = await Show.create({
      id: uuidv4(),
      movieId: body.movieId,
      movieTitle: body.movieTitle || "",
      date: body.date,
      time: body.time,
      hall: body.hall || "Hall A",
      occupiedSeats: []
    })

    res.json({ success: true, show: newShow.toJSON() })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Could not create show" })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const result = await Show.deleteOne({ id: req.params.id })
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Show not found" })
    }
    await require("../models/Booking").deleteMany({ showId: req.params.id })
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Could not delete" })
  }
})

module.exports = router
