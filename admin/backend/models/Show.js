const mongoose = require("mongoose")

const showSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  movieId: { type: String, required: true },
  movieTitle: { type: String, default: "" },
  date: { type: String, default: "" },
  time: { type: String, default: "" },
  hall: { type: String, default: "Hall A" },
  occupiedSeats: { type: [String], default: [] }
}, { timestamps: false, versionKey: false })

showSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret._id
    return ret
  }
})

module.exports = mongoose.model("Show", showSchema)
