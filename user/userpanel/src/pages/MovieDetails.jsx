import { useLocation, useParams, Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"
import { API_BASE, mediaUrl } from "../api/config"

export default function MovieDetails() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const initial = location.state || null

  const [movie, setMovie] = useState(initial)
  const [guestName, setGuestName] = useState("")
  const [commentText, setCommentText] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(API_BASE + "/api/movies/" + id)
        setMovie(res.data)
      } catch (e) {
        console.error(e)
        setMovie(null)
      }
    }
    load()
  }, [id])

  if (!movie) {
    return (
      <div>
        <Navbar />
        <div className="not-found-msg">
          <h2>Movie not found</h2>
          <button type="button" className="ghost-btn" onClick={() => navigate("/")}>
            Home
          </button>
        </div>
      </div>
    )
  }

  const poster = mediaUrl(movie.poster)
  const trailer = mediaUrl(movie.trailer)

  let durationLabel = ""
  const dn = Number(movie.duration)
  if (!isNaN(dn)) {
    durationLabel = dn + " min"
  } else if (movie.duration) {
    durationLabel = movie.duration
  }

  async function submitComment() {
    const trimmed = commentText.trim()
    if (!trimmed) {
      return
    }

    let namePosted = guestName.trim()
    if (!namePosted) {
      namePosted = "Guest"
    }

    try {
      setBusy(true)
      const res = await axios.post(API_BASE + "/api/movies/" + movie.id + "/comments", {
        user: namePosted,
        text: trimmed
      })
      if (res.data && res.data.comments) {
        setMovie({ ...movie, comments: res.data.comments })
      }
      setCommentText("")
      setBusy(false)
    } catch (error) {
      console.error(error)
      setBusy(false)
      alert("Comment could not be saved.")
    }
  }

  return (
    <div>
      <Navbar />
      <div className="movie-details">
        <div className="details-hero">
          {poster ? (
            <img
              src={poster}
              alt={movie.title}
              className="details-poster"
            />
          ) : (
            <div className="netflix-placeholder big">Poster</div>
          )}

          <div className="details-info">
            <h1 className="details-title">{movie.title}</h1>
            <p className="details-meta-netflix">
              {movie.language || "—"} · {movie.rating || "NR"} · {durationLabel}
            </p>
            <p className="details-meta-netflix muted">{movie.genre}</p>
            {movie.director && movie.director.trim().length > 0 ? (
              <p className="director-line"><strong>Director:</strong> {movie.director}</p>
            ) : null}
            {movie.cast && movie.cast.trim().length > 0 ? (
              <p className="director-line"><strong>Cast:</strong> {movie.cast}</p>
            ) : null}
            <p className="details-description">{movie.description}</p>

            <div className="details-buttons-row">
              <Link className="btn-netflix-primary" to={`/book/${movie.id}`} state={{ movie }}>
                Book tickets
              </Link>
            </div>
          </div>
        </div>

        {trailer ? (
          <div className="trailer-section">
            <h2>Trailer</h2>
            <div className="trailer-wrapper">
              <video src={trailer} controls width="100%" />
            </div>
          </div>
        ) : (
          <p className="netflix-muted padded">No trailer uploaded yet.</p>
        )}

        <div className="comments-section">
          <h3>Audience reviews</h3>

          <div className="comment-box">
            <input
              className="netflix-comment-name"
              value={guestName}
              placeholder="Your name"
              onChange={(e) => setGuestName(e.target.value)}
            />
            <div className="comment-row-netflix">
              <input
                value={commentText}
                placeholder="Say something about this movie…"
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button disabled={busy} type="button" onClick={submitComment}>
                Post
              </button>
            </div>
          </div>

          <div className="comments-list">
            {!movie.comments || movie.comments.length === 0 ? (
              <p className="netflix-muted">No comments yet. Be first.</p>
            ) : (
              movie.comments.map((c, i) => (
                <div key={i} className="comment-item">
                  <div className="avatar">★</div>
                  <div className="comment-content">
                    <span className="username">{c.user}</span>
                    <p>{c.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
