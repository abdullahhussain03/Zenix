const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
  user: { type: String, default: "Guest" },
  text: { type: String, default: "" }
}, { _id: false })

const movieSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, default: "" },
  genre: { type: String, default: "" },
  rating: { type: String, default: "" },
  status: { type: String, default: "Upcoming" },
  duration: { type: String, default: "" },
  price: { type: String, default: "1000" },
  language: { type: String, default: "" },
  director: { type: String, default: "" },
  cast: { type: String, default: "" },
  description: { type: String, default: "" },
  poster: { type: String, default: null },
  trailer: { type: String, default: null },
  comments: { type: [commentSchema], default: [] }
}, { timestamps: true, versionKey: false })

movieSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret._id
    return ret
  }
})

module.exports = mongoose.model("Movie", movieSchema)
