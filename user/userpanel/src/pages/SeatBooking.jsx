import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import SeatSelector from "../components/SeatSelector";
import PaymentForm from "../components/PaymentForm";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "../api/config";
import "../style/wajeehaBooking.css";

function buildSeatLayout(occupiedLookup) {
  const template = [
    [1, 1, 0, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
  ];

  const rows = [];
  let rowIndex = 0;
  while (rowIndex < template.length) {
    const row = [];
    let colIndex = 0;
    while (colIndex < template[rowIndex].length) {
      const label = "R" + (rowIndex + 1) + " S" + (colIndex + 1);
      let value = template[rowIndex][colIndex];
      if (occupiedLookup[label] === true) {
        value = 0;
      }
      row.push(value);
      colIndex++;
    }
    rows.push(row);
    rowIndex++;
  }
  return rows;
}

export default function SeatBooking() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const routeState = useLocation().state || {};

  const [seatsLayout, setSeatsLayout] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(routeState.show || null);
  const movieId = routeState.movieId || "";
  const movieTitle = routeState.movieTitle || "";
  const priceEach =
    typeof routeState.price === "number" ? routeState.price : 1000;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "" });
  const [currentStep, setCurrentStep] = useState("selection");

  useEffect(() => {
    async function fetchShow() {
      try {
        const res = await axios.get(API_BASE + "/api/shows/detail/" + showId);
        const s = res.data;
        setShowInfo(s);
        const occ = {};
        const list = s.occupiedSeats || [];
        let i = 0;
        while (i < list.length) {
          occ[list[i]] = true;
          i++;
        }
        setSeatsLayout(buildSeatLayout(occ));
      } catch (err) {
        console.error(err);
        alert("This show is unavailable.");
        navigate("/");
      }
      setLoading(false);
    }
    fetchShow();
  }, [showId, navigate]);

  const handleSeatClick = (rowIndex, colIndex) => {
    const layout = seatsLayout;
    const rowArr = layout[rowIndex];
    if (!rowArr) {
      return;
    }
    if (rowArr[colIndex] === 0) {
      return;
    }

    const id = "R" + (rowIndex + 1) + " S" + (colIndex + 1);
    let found = false;
    const filtered = [];
    let k = 0;
    while (k < selectedSeats.length) {
      if (selectedSeats[k] === id) {
        found = true;
      } else {
        filtered.push(selectedSeats[k]);
      }
      k++;
    }
    if (!found) {
      filtered.push(id);
    }
    setSelectedSeats(filtered);
  };

  async function submitBooking() {
    if (selectedSeats.length === 0) {
      alert("Pick at least one seat.");
      setCurrentStep("selection");
      return;
    }

    try {
      const body = {
        showId: showInfo.id,
        movieId: movieId.length > 0 ? movieId : showInfo.movieId,
        movieTitle:
          movieTitle.length > 0 ? movieTitle : showInfo.movieTitle,
        userName: userInfo.name,
        userEmail: userInfo.email,
        userPhone: userInfo.phone,
        seats: selectedSeats,
        amount: selectedSeats.length * priceEach
      };
      await axios.post(API_BASE + "/api/bookings", body);
      setCurrentStep("success");
    } catch (e) {
      console.error(e);
      let msg =
        "Could not complete booking. Refresh and try another seat.";
      if (
        e.response &&
        e.response.data &&
        e.response.data.message
      ) {
        msg = e.response.data.message;
      }
      alert(msg);
      setCurrentStep("selection");
      window.location.reload();
    }
  }

  if (loading || seatsLayout.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="wajeeha-booking-page">
          <p style={{ color: "#888" }}>Loading seats…</p>
        </div>
      </div>
    );
  }

  if (currentStep === "success") {
    return (
      <div>
        <Navbar />
        <div className="success-card">
          <h2 className="white-text">BOOKING SUCCESSFUL!</h2>
          <button type="button" className="confirm-btn" onClick={() => navigate("/")}>
            DONE
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === "payment") {
    return (
      <div>
        <Navbar />
        <div className="wajeeha-booking-page">
          <PaymentForm
            amount={selectedSeats.length * priceEach}
            onBack={() => setCurrentStep("selection")}
            onSuccess={submitBooking}
          />
        </div>
      </div>
    );
  }

  function goPayment() {
    if (selectedSeats.length === 0) {
      alert("Please select seats first.");
      return;
    }
    if (!userInfo.name || userInfo.name.trim().length < 2) {
      alert("Please enter your full name.");
      return;
    }
    setCurrentStep("payment");
  }

  const displayTitle =
    movieTitle.length > 0 ? movieTitle : showInfo.movieTitle || "Movie";

  return (
    <div>
      <Navbar />
      <div className="wajeeha-booking-page">
        <h1 className="wajeeha-booking-heading">{displayTitle}</h1>
        <p className="wajeeha-booking-meta">
          {showInfo.date} · {showInfo.time} · {showInfo.hall}
        </p>

        <SeatSelector
          seats={seatsLayout}
          selectedSeats={selectedSeats}
          onSeatClick={handleSeatClick}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          priceEach={priceEach}
          onConfirmSelection={goPayment}
          onCancel={() => navigate(-1)}
        />
      </div>
    </div>
  );
}
