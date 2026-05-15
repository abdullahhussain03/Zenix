export default function SeatSelector({
  seats,
  selectedSeats,
  onSeatClick,
  userInfo,
  setUserInfo,
  priceEach,
  onConfirmSelection,
  onCancel
}) {
  return (
    <div className="theatre-wrapper">
      <div className="wajeeha-screen-bar">SCREEN</div>
      <div className="seat-grid">
        {seats.map((row, rIdx) => (
          <div key={rIdx} className="seat-row-container">
            <span className="row-label">R{rIdx + 1}</span>
            <div className="seat-row">
              {row.map((status, sIdx) => {
                const id = "R" + (rIdx + 1) + " S" + (sIdx + 1);
                let seatClass = "seat";

                if (status === 0) {
                  seatClass = seatClass + " occupied";
                } else if (selectedSeats.includes(id)) {
                  seatClass = seatClass + " selected";
                }

                return (
                  <div
                    key={sIdx}
                    role="presentation"
                    className={seatClass}
                    onClick={() => onSeatClick(rIdx, sIdx)}
                  >
                    {sIdx + 1}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="info-section">
        <input
          type="text"
          placeholder="Full Name"
          className="zenix-input"
          value={userInfo.name}
          onChange={(e) =>
            setUserInfo({ ...userInfo, name: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Email Address"
          className="zenix-input"
          value={userInfo.email}
          onChange={(e) =>
            setUserInfo({ ...userInfo, email: e.target.value })
          }
        />
        <input
          type="tel"
          placeholder="Phone Number"
          className="zenix-input"
          value={userInfo.phone}
          onChange={(e) =>
            setUserInfo({ ...userInfo, phone: e.target.value })
          }
        />

        <div className="selection-summary">
          {selectedSeats.length > 0
            ? "Selected: " +
              selectedSeats.join(", ") +
              " · Total: " +
              (selectedSeats.length * priceEach).toLocaleString() +
              " PKR"
            : "Selected: None"}
        </div>

        <button type="button" className="confirm-btn" onClick={onConfirmSelection}>
          CONFIRM SELECTION
        </button>

        {onCancel && (
          <button type="button" className="wajeeha-cancel-small" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
