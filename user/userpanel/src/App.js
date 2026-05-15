import Navbar from "./components/Navbar";
import Home from "./pages/home";
import MovieDetails from "./pages/MovieDetails";
import PickShowtimes from "./pages/PickShowtimes";
import SeatBooking from "./pages/SeatBooking";
import AppLogin from "./pages/AppLogin";
import { Routes, Route, Navigate } from "react-router-dom";
import { RequireCustomer, RequireStaff } from "./components/RequireAuth";
import "./style/main.css";

import StaffDashboard from "./staff/Dashboard";
import AddMovie from "./staff/AddMovie";
import EditMovie from "./staff/EditMovie";
import ManageMovies from "./staff/ManageMovies";
import ManageShows from "./staff/ManageShows";
import ManageBookings from "./staff/ManageBookings";

function App() {
  return (
    <div className="app-netflix-shell">
      <Routes>
        <Route path="/login" element={<AppLogin />} />

        <Route element={<RequireCustomer />}>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/book/:movieId" element={<PickShowtimes />} />
          <Route path="/book-seat/:showId" element={<SeatBooking />} />
        </Route>

        <Route element={<RequireStaff />}>
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/add-movie" element={<AddMovie />} />
          <Route path="/staff/edit-movie/:id" element={<EditMovie />} />
          <Route path="/staff/manage-movies" element={<ManageMovies />} />
          <Route path="/staff/manage-shows" element={<ManageShows />} />
          <Route path="/staff/manage-bookings" element={<ManageBookings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
