import React, { useState, useEffect } from 'react'
import Navbar from "./Navbar"
import "./manageBookings.css"
import axios from "axios"
import { API_BASE } from "../api/config"

const ManageBookings = () => {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const res = await axios.get(API_BASE + "/api/bookings")
      setBookings(res.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  const deleteBooking = async (id) => {
    if (!window.confirm("Cancel this booking and free the seats?")) {
      return
    }
    try {
      await axios.delete(API_BASE + "/api/bookings/" + id)
      fetchBookings()
      alert("Booking cancelled.")
    } catch (error) {
      console.error(error)
      alert("Failed to cancel.")
    }
  }

  const confirmed =
    bookings.filter((b) => b.status === "Confirmed").length
  const pending = bookings.filter((b) => b.status === "Pending").length

  return (
    <div className="manage-bookings-page">
      <Navbar />
      <div className="main-content">

        <h2 className="page-title">Manage Bookings</h2>

        <div className="stats-row">
          <div className="stat-card">
            <h3>{bookings.length}</h3>
            <p>Total Bookings</p>
          </div>
          <div className="stat-card">
            <h3>{confirmed}</h3>
            <p>Confirmed</p>
          </div>
          <div className="stat-card">
            <h3>{pending}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="bookings-table">
          <table>
            <thead>
              <tr>
                <th>Booking</th>
                <th>Movie</th>
                <th>User</th>
                <th>Seats</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan={8}>No bookings yet.</td></tr>
              ) : bookings.map(booking => (
                <tr key={booking.id}>
                  <td>#{booking.id.slice(0, 8)}</td>
                  <td>{booking.movieTitle}</td>
                  <td>{booking.userName}</td>
                  <td>{booking.seats}</td>
                  <td>{booking.date}</td>
                  <td>{booking.time}</td>
                  <td>
                    <span className={`status-badge ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-delete" onClick={() => deleteBooking(booking.id)}>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default ManageBookings
