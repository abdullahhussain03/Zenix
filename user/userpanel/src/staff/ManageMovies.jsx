import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import Navbar from "./Navbar"
import "./manageMovies.css"
import axios from "axios"
import { API_BASE, mediaUrl } from "../api/config"

const ManageMovies = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      const response = await axios.get(API_BASE + "/api/movies")
      setMovies(response.data)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const deleteMovie = async (id) => {
    if (window.confirm("Delete this movie?")) {
      try {
        await axios.delete(API_BASE + "/api/movies/" + id)
        fetchMovies()
        alert("Movie deleted!")
      } catch (error) {
        alert("Failed to delete")
      }
    }
  }
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
  return (
    <div className="manage-movies-page">
      <Navbar />
      <div className="main-content">
        
        <h2 className="page-title">Manage Movies</h2>

        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search movies..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        {loading ? (
          <p className="loading">Loading movies...</p>
        ) : (
          <div className="movies-table">
            <table>
              <thead>
                <tr>
                  <th>Poster</th>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovies.map(movie => (
                  <tr key={movie.id}>
                    <td>
                      {movie.poster ? (
                        <img src={mediaUrl(movie.poster)} alt={movie.title} className="table-poster" />
                      ) : (
                        <i className="fa-solid fa-film"></i>
                      )}
                    </td>
                    <td>{movie.title}</td>
                    <td>{movie.genre}</td>
                    <td>
                      <span className={`status-badge ${movie.status === "Now Showing" ? "active" : "upcoming"}`}>
                        {movie.status}
                      </span>
                    </td>
                    <td>{movie.duration} min</td>
                    <td>
                      <Link to={`/staff/edit-movie/${movie.id}`} className="btn-edit">Edit</Link>
                      <button className="btn-delete" onClick={() => deleteMovie(movie.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageMovies
