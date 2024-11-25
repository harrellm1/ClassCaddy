'use client';

import { useState } from "react";

export default function Payment({ goToNextPage }: { goToNextPage: (page: string) => void }) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState({ cardNumber: "", expiry: "", cvv: "" });
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });

  const handleCompletePayment = () => {
    if (selectedPlan && cardDetails.cardNumber && loginInfo.email) {
      alert(`Payment for the ${selectedPlan} plan has been processed.`);
      goToNextPage("calendar");
    } else {
      alert("Please complete all fields before proceeding.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#7197C1",
        color: "#333",
        padding: "20px",
      }}
    >
      {/* Title */}
      <h1 style={{ fontSize: "36px", marginBottom: "10px", color: "#FFFFFF" }}>
        Complete Your Payment
      </h1>
      <p style={{ fontSize: "18px", marginBottom: "30px", textAlign: "center", maxWidth: "500px", color: "#FFFFFF" }}>
        Select your premium plan, enter payment details, and confirm your login information.
      </p>

      {/* Select Premium Plan */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "10px", color: "#FFFFFF" }}>Select Your Premium Plan</h3>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            onClick={() => setSelectedPlan("Monthly")}
            style={{
              padding: "10px 15px",
              backgroundColor: selectedPlan === "Monthly" ? "#FECB00" : "#ddd",
              color: selectedPlan === "Monthly" ? "#fff" : "#333",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Monthly - $3.99
          </button>
          <button
            onClick={() => setSelectedPlan("Yearly")}
            style={{
              padding: "10px 15px",
              backgroundColor: selectedPlan === "Yearly" ? "#FECB00" : "#ddd",
              color: selectedPlan === "Yearly" ? "#fff" : "#333",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Yearly - $12.99
          </button>
          <button
            onClick={() => setSelectedPlan("Lifetime")}
            style={{
              padding: "10px 15px",
              backgroundColor: selectedPlan === "Lifetime" ? "#FECB00" : "#ddd",
              color: selectedPlan === "Lifetime" ? "#fff" : "#333",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Lifetime - $49.99
          </button>
        </div>
      </div>

      {/* Enter Card Details */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "10px", color: "#FFFFFF" }}>Enter Card Details</h3>
        <input
          type="text"
          placeholder="Card Number"
          value={cardDetails.cardNumber}
          onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
          style={{ margin: "5px", padding: "10px", width: "250px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="Expiry (MM/YY)"
          value={cardDetails.expiry}
          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
          style={{ margin: "5px", padding: "10px", width: "142px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="CVV"
          value={cardDetails.cvv}
          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
          style={{ margin: "5px", padding: "10px", width: "80px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>

      {/* Enter Login Information */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "10px", color: "#FFFFFF" }}>Confirm Login Information</h3>
        <input
          type="email"
          placeholder="Email"
          value={loginInfo.email}
          onChange={(e) => setLoginInfo({ ...loginInfo, email: e.target.value })}
          style={{ margin: "5px", padding: "10px", width: "300px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={loginInfo.password}
          onChange={(e) => setLoginInfo({ ...loginInfo, password: e.target.value })}
          style={{ margin: "5px", padding: "10px", width: "300px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>

      {/* Complete Payment Button */}
      <button
        onClick={handleCompletePayment}
        style={{
          padding: "12px 18px",
          backgroundColor: "#446486",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Complete Payment
      </button>

      {/* Cancel Button */}
      <button
        onClick={() => goToNextPage("calendar")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#fff",
          color: "#446486",
          
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Cancel
      </button>
    </div>
  );
}
