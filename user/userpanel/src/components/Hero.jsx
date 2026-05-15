import { Link } from "react-router-dom"
import { mediaUrl } from "../api/config"

export default function Hero({ featuredMovie }) {
  const backdrop = featuredMovie ? mediaUrl(featuredMovie.poster) : null
  const teaser = featuredMovie ? featuredMovie.description : ""

  return (
    <div className="netflix-hero">
      <div className="netflix-hero-bg">
        {backdrop ? (
          <img src={backdrop} alt="" className="netflix-hero-img" />
        ) : (
          <div className="netflix-hero-fallback" />
        )}
      </div>
      <div className="netflix-hero-shade" />
      <div className="netflix-hero-content">
        <p className="netflix-brand-sm">ORIGINAL SERIES STYLE — ZENIX CINEMA</p>
        <h1>ZENIX</h1>
        <p className="netflix-hero-teaser">
          {featuredMovie
            ? teaser
            : "Watch new releases on the big screen. Book seats in seconds."}
        </p>
        <div className="hero-buttons-row">
          {featuredMovie ? (
            <Link
              className="btn-netflix-primary"
              to={`/movie/${featuredMovie.id}`}
              state={featuredMovie}
            >
              ▶ Details
            </Link>
          ) : (
            <span className="btn-netflix-muted">Explore below</span>
          )}
          {featuredMovie && (
            <Link
              className="btn-netflix-outline"
              to={`/book/${featuredMovie.id}`}
              state={{ movie: featuredMovie }}
            >
              Tickets
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
