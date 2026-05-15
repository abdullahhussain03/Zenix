import { Link } from "react-router-dom"
import { mediaUrl } from "../api/config"

export default function MovieCard({ movie }) {
  const cover = mediaUrl(movie.poster)

  let durationLabel = ""
  const dRaw = movie.duration
  const dNum = Number(dRaw)
  if (!isNaN(dNum)) {
    durationLabel = dNum + " min"
  } else if (dRaw && dRaw.trim().length > 0) {
    durationLabel = dRaw
  }

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="netflix-card-link"
      state={movie}
    >
      <div className="netflix-card">
        {cover ? (
          <img src={cover} alt={movie.title} loading="lazy" />
        ) : (
          <div className="netflix-placeholder">No poster</div>
        )}
        <div className="netflix-card-info">
          <h3>{movie.title}</h3>
          <p className="netflix-meta">{movie.genre}</p>
          <p className="netflix-meta">{durationLabel}</p>
        </div>
      </div>
    </Link>
  )
}
