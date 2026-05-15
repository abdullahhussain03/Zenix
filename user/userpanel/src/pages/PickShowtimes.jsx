import { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
import { API_BASE } from "../api/config"

export default function PickShowtimes() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function run() {
      try {
        const resMovie = await axios.get(API_BASE + "/api/movies/" + movieId)
        setMovie(resMovie.data)
        const sr = await axios.get(API_BASE + "/api/shows", {
          params: { movieId }
        })
        setShows(sr.data || [])
      } catch (e) {
        console.error(e)
        alert("Movie or schedule not available.")
        navigate("/")
      }
      setLoading(false)
    }
    run()
  }, [movieId, navigate])

  if (loading || !movie) {
    return (
      <div>
        <Navbar />
        <div className="booking-page-inner">
          <p className="netflix-accent">Loading showtimes…</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="booking-page-inner pick-show-inner">
        <h1 className="details-title">{movie.title}</h1>
        <p className="netflix-accent">Pick a showtime</p>

        {shows.length === 0 ? (
          <p className="netflix-muted">
            No screenings yet. Ask the admin to add one.
          </p>
        ) : (
          <ul className="showtime-list">
            {shows.map((s) => {
              let ticketPrice = Number(movie.price)
              if (isNaN(ticketPrice)) {
                ticketPrice = 1000
              }
              return (
              <li key={s.id}>
                <div>
                  <strong>
                    {s.date} · {s.time}
                  </strong>
                  <span className="netflix-muted">{s.hall}</span>
                </div>
                <Link
                  className="btn-netflix-primary"
                  to={`/book-seat/${s.id}`}
                  state={{
                    show: s,
                    movieId: movie.id,
                    movieTitle: movie.title,
                    price: ticketPrice
                  }}
                >
                  Select seats
                </Link>
              </li>
            )})}
          </ul>
        )}
        <button className="back-link-btn" type="button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  )
}
