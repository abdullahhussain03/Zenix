import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";
import { clearSession } from "../auth/session";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const goSignOut = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  const path = location.pathname;

  return (
    <div className="navbar">
      <nav className="navbar navbar-expand-sm bg-dark">
        <div className="container-fluid">
          <div className="logo-part">
            <ul className="navbar-nav flex-row align-items-center">
              {/* <li className="nav-item"> */}
              {/* <img 
                src="/assets/logo.png" 
                alt="Logo" 
                className="logo"
                style={{ width: "50px", height: "50px", objectFit: "contain" }}
              />              </li> */}
              <li className="nav-item">
                <Link to="/staff" className="text-white zynix text-decoration-none">
                  ZENIX
                </Link>
              </li>
            </ul>
          </div>
          <div className="nav-links">
            <ul className="navbar-nav flex-row">
              <li className="nav-item">
                <Link
                  to="/staff"
                  className={`nav-link ${path === "/staff" ? "active" : ""}`}
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/staff/manage-movies"
                  className={`nav-link ${path === "/staff/manage-movies" ? "active" : ""}`}
                >
                  Movies
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/staff/manage-shows"
                  className={`nav-link ${path === "/staff/manage-shows" ? "active" : ""}`}
                >
                  Shows
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/staff/manage-bookings"
                  className={`nav-link ${path === "/staff/manage-bookings" ? "active" : ""}`}
                >
                  Bookings
                </Link>
              </li>
            </ul>
          </div>
          <div className="btn-part">
            <Link to="/" className="nav-item">
              <button type="button" className="add">
                Customer site
              </button>
            </Link>
            <Link to="/staff/add-movie" className="nav-item">
              <button type="button" className="add">
                + Add Movie
              </button>
            </Link>
            <div className="nav-item">
              <button type="button" className="signout" onClick={goSignOut}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
