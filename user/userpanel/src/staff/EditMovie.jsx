import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import "./editMovie.css"
import axios from "axios"
import { API_BASE, mediaUrl } from "../api/config"

const EditMovie = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [poster, setPoster] = useState(null)
  const [trailer, setTrailer] = useState(null)

  useEffect(() => {
    fetchMovie()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchMovie = async () => {
    try {
      const response = await axios.get(API_BASE + "/api/movies/" + id)
      setMovie(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value })
  }

const handleSubmit = async (e) => {
  e.preventDefault()

  const data = new FormData()

  const editableFields = ["title", "genre", "status", "duration", "price", "description"]
  editableFields.forEach(key => {
    if (movie[key] !== undefined && movie[key] !== null) {
      data.append(key, movie[key])
    }
  })

  if (poster) data.append("poster", poster)
  if (trailer) data.append("trailer", trailer)

  try {
    await axios.put(`${API_BASE}/api/movies/${id}`, data)
    alert("Movie Updated!")
    navigate("/staff")
  } catch (error) {
    console.error(error.response?.data || error)
    alert(error.response?.data?.message || "Failed to update")
  }
}

  if (!movie) return <p className="loading">Loading...</p>

  return (
    <div className="edit-movie-page">
      <Navbar />
      <div className="form-container">
        <h2>Edit Movie</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Current Poster</label>
            {movie.poster && (
              <img src={mediaUrl(movie.poster)} alt="Current" className="current-poster" />
            )}
            <input type="file" name="poster" accept="image/*" onChange={(e) => setPoster(e.target.files[0])} />
          </div>

          <div className="form-group">
            <label>Current Trailer</label>
            {movie.trailer && <p className="file-info">Trailer exists</p>}
            <input type="file" name="trailer" accept="video/*" onChange={(e) => setTrailer(e.target.files[0])} />
          </div>

          <div className="form-group">
            <label>Title</label>
            <input type="text" name="title" value={movie.title} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Genre</label>
              <select name="genre" value={movie.genre} onChange={handleChange}>
                <option>Action</option>
                <option>Comedy</option>
                <option>Drama</option>
                <option>Horror</option>
                <option>Sci-Fi</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={movie.status} onChange={handleChange}>
                <option>Upcoming</option>
                <option>Now Showing</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Duration (min)</label>
              <input type="number" name="duration" value={movie.duration} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Price ($)</label>
              <input type="number" name="price" value={movie.price} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={movie.description} onChange={handleChange} rows="4" />
          </div>

          <button type="submit" className="submit-btn">Update Movie</button>
        </form>
      </div>
    </div>
  )
}

export default EditMovie
