import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import { API_BASE } from "../api/config"
import { setSession, getRole } from "../auth/session"
import "./appLogin.css"

export default function AppLogin() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const existing = getRole()
    if (existing === "admin") {
      navigate("/staff", { replace: true })
    }
    if (existing === "user") {
      navigate("/", { replace: true })
    }
  }, [navigate])
  const from = location.state && location.state.from
    ? location.state.from.pathname || "/"
    : "/"

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setBusy(true)
    try {
      const res = await axios.post(API_BASE + "/api/auth/login", {
        username,
        password
      })
      if (res.data && res.data.ok) {
        setSession(res.data.role, res.data.username)
        if (res.data.role === "admin") {
          navigate("/staff", { replace: true })
        } else {
          navigate(from === "/login" || from === "/staff" ? "/" : from, {
            replace: true
          })
        }
      } else {
        alert("Login failed.")
      }
    } catch (err) {
      const msg =
        err.response &&
        err.response.data &&
        err.response.data.message
          ? err.response.data.message
          : "Cannot reach server. Start the backend."
      alert(msg)
    }
    setBusy(false)
  }

  return (
    <div className="app-login-shell">
      <div className="app-login-panel">
        <h1>ZENIX</h1>
        <p className="subtitle">Movies &amp; staff — one login</p>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button type="submit" disabled={busy}>
            {busy ? "Please wait…" : "Sign in"}
          </button>
        </form>
        <div className="hint-block">
          <p>
            <strong>Customer:</strong> user / user123
          </p>
          <p>
            <strong>Staff:</strong> admin / admin123
          </p>
        </div>
      </div>
    </div>
  )
}
