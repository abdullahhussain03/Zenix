const express = require("express")
const router = express.Router()

router.post("/login", (req, res) => {
  const body = req.body || {}
  const username = typeof body.username === "string" ? body.username.trim() : ""
  const password = typeof body.password === "string" ? body.password : ""

  if (username === "admin" && password === "admin123") {
    return res.json({ ok: true, role: "admin", username: "admin" })
  }

  if (username === "user" && password === "user123") {
    return res.json({ ok: true, role: "user", username: username })
  }

  return res.status(401).json({ ok: false, message: "Invalid username or password" })
})

router.post("/logout", (req, res) => {
  res.json({ ok: true })
})

module.exports = router
