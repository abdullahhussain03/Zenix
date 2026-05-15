import { useState } from "react";
const PaymentForm = ({ amount, onBack, onSuccess }) => {
  const [method, setMethod] = useState("card");
  let inputFields;
  if (method === "card") {
    inputFields = (
      <div>
        <input type="text" placeholder="Card Number" className="zenix-input" />
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <input
            type="text"
            placeholder="MM/YY"
            className="zenix-input"
            style={{ flex: 1 }}
          />
          <input
            type="text"
            placeholder="CVV"
            className="zenix-input"
            style={{ flex: 1 }}
          />
        </div>
      </div>
    );
  } else {
    inputFields = (
      <input
        type="text"
        placeholder="Mobile Account Number"
        className="zenix-input"
      />
    );
  }

  let cardClass = "m-btn";
  let jazzClass = "m-btn";
  let easyClass = "m-btn";
  if (method === "card") {
    cardClass = cardClass + " active";
  } else if (method === "jazz") {
    jazzClass = jazzClass + " active";
  } else if (method === "easy") {
    easyClass = easyClass + " active";
  }
  return (
    <div className="payment-card">
      <h2 className="payment-method-title">PAYMENT METHOD</h2>
      <p style={{ color: "#888", marginBottom: "15px" }}>
        Total Amount: {amount} PKR
      </p>

      <div className="method-selector">
        <button
          type="button"
          className={cardClass}
          onClick={() => setMethod("card")}
        >
          Debit/Credit
        </button>
        <button type="button" className={jazzClass} onClick={() => setMethod("jazz")}>
          JazzCash
        </button>
        <button type="button" className={easyClass} onClick={() => setMethod("easy")}>
          EasyPaisa
        </button>
      </div>

      {inputFields}

      <button
        type="button"
        className="confirm-btn"
        style={{ marginTop: "20px", width: "100%" }}
        onClick={onSuccess}
      >
        PAY NOW
      </button>
      <button type="button" onClick={onBack} className="back-link">
        Go Back
      </button>
    </div>
  );
};

export default PaymentForm;
