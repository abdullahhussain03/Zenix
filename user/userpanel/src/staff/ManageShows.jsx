import React, { useState, useEffect } from 'react'
import Navbar from "./Navbar"
import "./manageShows.css"
import axios from "axios"
import { API_BASE } from "../api/config"

const ManageShows = () => {
  const [movies, setMovies] = useState([])
  const [shows, setShows] = useState([])
  const [selectedMovie, setSelectedMovie] = useState("")
  const [showDate, setShowDate] = useState("")
  const [showTime, setShowTime] = useState("")
  const [hall, setHall] = useState("Hall A")

  useEffect(() => {
    fetchMovies()
    fetchShows()
  }, [])
  const fetchMovies = async () => {
    try {
      const response = await axios.get(API_BASE + "/api/movies")
      setMovies(response.data)
    } catch (error) {
      console.error(error)
    }
  }
  const fetchShows = async () => {
    try {
      const response = await axios.get(API_BASE + "/api/shows")
      setShows(response.data)
    } catch (error) {
      console.error(error)
    }
  }
  const addShow = async (e) => {
    e.preventDefault()
    if (!selectedMovie || !showDate || !showTime) {
      alert("Please fill all fields")
      return
    }
    try {
      let movieTitle = ""
      let idx = 0
      while (idx < movies.length) {
        if (movies[idx].id === selectedMovie) {
          movieTitle = movies[idx].title || ""
          break
        }
        idx++
      }
      await axios.post(API_BASE + "/api/shows", {
        movieId: selectedMovie,
        movieTitle: movieTitle,
        date: showDate,
        time: showTime,
        hall: hall
      })
      alert("Show added successfully!")
      setShowDate("")
      setShowTime("")
      fetchShows()
    } catch (err) {
      console.error(err)
      alert("Could not save show.")
    }
  }
  const deleteShow = async (id) => {
    if (!window.confirm("Cancel this screening? Bookings tied to it will also be cleared.")) {
      return
    }
    try {
      await axios.delete(API_BASE + "/api/shows/" + id)
      fetchShows()
      alert("Show cancelled.")
    } catch (error) {
      console.error(error)
      alert("Delete failed.")
    }
  }
  return (
    <div className="manage-shows-page">
      <Navbar />
      <div className="main-content">
        <h2 className="page-title">Manage Shows</h2>
        <div className="add-show-form">
          <h3>Add New Show</h3>
          <form onSubmit={addShow}>
            <div className="form-row">
              <div className="form-group">
                <label>Select Movie</label>
                <select value={selectedMovie} onChange={(e) => setSelectedMovie(e.target.value)}>
                  <option value="">Choose a movie</option>
                  {movies.map(movie => (
                    <option key={movie.id} value={movie.id}>{movie.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={showDate} onChange={(e) => setShowDate(e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Time</label>
                <input type="time" value={showTime} onChange={(e) => setShowTime(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Hall</label>
                <select value={hall} onChange={(e) => setHall(e.target.value)}>
                  <option>Hall A</option>
                  <option>Hall B</option>
                  <option>Hall C</option>
                </select>
              </div>
            </div>
            <button type="submit" className="submit-btn">Add Show</button>
          </form>
        </div>

        <div className="shows-list">
          <h3>Scheduled Shows</h3>
          {shows.length === 0 ? (
            <p className="no-data">No shows scheduled</p>
          ) : (
            <div className="shows-grid">
              {shows.map(show => (
                <div className="show-card" key={show.id}>
                  <div className="show-info">
                    <h4>{show.movieTitle}</h4>
                    <p><i className="fa-regular fa-calendar"></i> {show.date}</p>
                    <p><i className="fa-regular fa-clock"></i> {show.time}</p>
                    <p><i className="fa-solid fa-location-dot"></i> {show.hall}</p>
                  </div>
                  <button className="btn-delete" onClick={() => deleteShow(show.id)}>Cancel</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageShows
