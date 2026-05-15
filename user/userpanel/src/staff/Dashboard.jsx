import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import Navbar from "./Navbar"
import "./dashboard.css"
import axios from "axios"
import { API_BASE, mediaUrl } from "../api/config"

const Dashboard = () => {
  const [movies, setMovies] = useState([])
  const [bookCount, setBookCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMovies()
    fetchBookingCount()
  }, [])

  const fetchBookingCount = async () => {
    try {
      const res = await axios.get(API_BASE + "/api/bookings")
      const rows = res.data || []
      setBookCount(rows.length)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      setBookCount(0)
    }
  }

  const fetchMovies = async () => {
    try {
      const response = await axios.get(API_BASE + "/api/movies")
      setMovies(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching movies:", error)
      setLoading(false)
    }
  }

  const deleteMovie = async (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await axios.delete(API_BASE + "/api/movies/" + id)
        fetchMovies()
        fetchBookingCount()
        alert("Movie deleted successfully!")
      } catch (error) {
        console.error("Error deleting movie:", error)
        alert("Failed to delete movie")
      }
    }
  }

  const totalMovies = movies.length
  const nowShowing = movies.filter(m => m.status === "Now Showing").length
  const upcoming = movies.filter(m => m.status === "Upcoming").length
  const totalBookings = bookCount

  return (
    <div className='dashboard-page'>
      <Navbar />
      
      <div className="main-content">
        
        <div className="stats-container">
          
          <div className="stat-card total-movies">
            <i className="fa-solid fa-film icon"></i>
            <p className="stat-number">{totalMovies}</p>
            <p className="stat-label">Total Movies</p>
          </div>

          <div className="stat-card now-showing">
            <i className="fa-solid fa-video icon"></i>
            <p className="stat-number">{nowShowing}</p>
            <p className="stat-label">Now Showing</p>
          </div>

          <div className="stat-card upcoming">
            <i className="fa-regular fa-calendar-days icon"></i>
            <p className="stat-number">{upcoming}</p>
            <p className="stat-label">Upcoming</p>
          </div>

          <div className="stat-card total-bookings">
            <i className="fa-solid fa-ticket icon"></i>
            <p className="stat-number">{totalBookings}</p>
            <p className="stat-label">Total Bookings</p>
          </div>

        </div>

        <h2 className="page-title">Recent Movies</h2>

        {loading ? (
          <div className="loading">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <p>Loading movies...</p>
          </div>
        ) : (
          /* Movies Grid */
          <div className="movies-grid">
            {movies.length === 0 ? (
              <div className="no-movies">
                <i className="fa-solid fa-film"></i>
                <p>No movies added yet</p>
                <Link to="/staff/add-movie" className="btn-add">Add First Movie</Link>
              </div>
            ) : (
              movies.slice(0, 8).map(movie => (
                <div className="movie-card" key={movie.id}>
                  
                  <div className="movie-poster">
                    {movie.poster ? (
                      <img src={mediaUrl(movie.poster)} alt={movie.title} />
                    ) : (
                      <i className="fa-solid fa-film fa-3x"></i>
                    )}
                    <span className={`status-tag ${movie.status === "Now Showing" ? "active" : "upcoming"}`}>
                      {movie.status}
                    </span>
                  </div>

                  <div className="movie-details">
                    <h3 className="movie-title">{movie.title}</h3>
                    
                    <div className="movie-tags">
                      <span className="tag">{movie.genre}</span>
                      <span className="tag">{movie.rating}</span>
                      <span className="tag">{movie.duration} min</span>
                    </div>

                    <p className="movie-description">
                      {movie.description ? movie.description.substring(0, 100) + "..." : "No description"}
                    </p>

                    <div className="movie-actions">
                      <Link to={`/staff/edit-movie/${movie.id}`} className="btn-edit">
                        <i className="fa-solid fa-pen"></i> Edit
                      </Link>
                      <button className="btn-delete" onClick={() => deleteMovie(movie.id)}>
                        <i className="fa-solid fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard
