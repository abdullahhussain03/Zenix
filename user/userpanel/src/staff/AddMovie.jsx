import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import "./addMovie.css"
import axios from "axios"
import { API_BASE } from "../api/config"

const AddMovie = () => {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: "", genre: "Action", rating: "PG-13", status: "Upcoming",
    duration: "", price: "", language: "", director: "", cast: "",
    description: ""
  })
  
  const [poster, setPoster] = useState(null)
  const [trailer, setTrailer] = useState(null)
  const [preview, setPreview] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePosterChange = (e) => {
    const file = e.target.files[0]
    setPoster(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTrailerChange = (e) => {
    const file = e.target.files[0]
    setTrailer(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const data = new FormData()
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key])
    })
    if (poster) data.append("poster", poster)
    if (trailer) data.append("trailer", trailer)

    try {
      const response = await axios.post(API_BASE + "/api/movies", data)
      
      if (response.data.success) {
        alert("Movie Added Successfully!")
        navigate("/staff")
      }
    } catch (error) {
      console.error(error)
      alert("Failed to add movie")
    }
  }

  return (
    <div className="add-movie-page">
      <Navbar />
      <div className="form-container">
        <h2>Add New Movie</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Movie Poster</label>
            <input type="file" name="poster" accept="image/*" onChange={handlePosterChange} />
            {preview && (
              <div className="poster-preview">
                <img src={preview} alt="Preview" />
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Movie Trailer (Video)</label>
            <input type="file" name="trailer" accept="video/*" onChange={handleTrailerChange} />
            {trailer && <p className="file-info">Selected: {trailer.name}</p>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input type="text" name="title" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Genre</label>
              <select name="genre" onChange={handleChange}>
                <option>Action</option>
                <option>Comedy</option>
                <option>Drama</option>
                <option>Horror</option>
                <option>Sci-Fi</option>
                <option>Thriller</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Rating</label>
              <select name="rating" onChange={handleChange}>
                <option>PG-13</option>
                <option>R</option>
                <option>PG</option>
                <option>NC-17</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" onChange={handleChange}>
                <option>Upcoming</option>
                <option>Now Showing</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Duration (min)</label>
              <input type="number" name="duration" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Price ($)</label>
              <input type="number" name="price" onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Language</label>
              <input type="text" name="language" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Director</label>
              <input type="text" name="director" onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Cast (comma-separated)</label>
            <input type="text" name="cast" onChange={handleChange} placeholder="Actor 1, Actor 2, Actor 3" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" onChange={handleChange} rows="4"></textarea>
          </div>
          <button type="submit" className="submit-btn">Add Movie</button>
        </form>
      </div>
    </div>
  )
}

export default AddMovie
