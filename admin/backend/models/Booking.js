const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  showId: { type: String, default: "" },
  movieId: { type: String, default: "" },
  movieTitle: { type: String, default: "" },
  userName: { type: String, default: "" },
  userEmail: { type: String, default: "" },
  userPhone: { type: String, default: "" },
  seats: { type: String, default: "" },
  hall: { type: String, default: "" },
  date: { type: String, default: "" },
  time: { type: String, default: "" },
  status: { type: String, default: "Confirmed" },
  amount: { type: Number, default: 0 }
}, { timestamps: true, versionKey: false })

bookingSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret._id
    return ret
  }
})

module.exports = mongoose.model("Booking", bookingSchema)
