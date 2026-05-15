import { useEffect, useState } from "react"
import axios from "axios"
import MovieCard from "../components/MovieCard"
import Hero from "../components/Hero"
import { API_BASE } from "../api/config"

const Home = () => {
  const [nowMovies, setNowMovies] = useState([])
  const [upMovies, setUpMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const response = await axios.get(API_BASE + "/api/movies")
        const all = response.data || []
        const now = []
        const up = []
        let index = 0
        while (index < all.length) {
          const m = all[index]
          if (m.status === "Now Showing") {
            now.push(m)
          } else {
            up.push(m)
          }
          index++
        }
        setNowMovies(now)
        setUpMovies(up)
        setLoading(false)
      } catch (e) {
        console.error(e)
        setError("Could not load movies. Is the server running on port 5000?")
        setLoading(false)
      }
    }
    load()
  }, [])

  const heroFeatured = nowMovies.length > 0 ? nowMovies[0] : null

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Loading…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="loading-screen netflix-accent">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="home-container">
      <Hero featuredMovie={heroFeatured} />

      <h2 className="section-heading">Now on Zenix</h2>
      <div className="row-scroll">
        {nowMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <h2 className="section-heading">Coming soon</h2>
      <div className="row-scroll">
        {upMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}

export default Home
