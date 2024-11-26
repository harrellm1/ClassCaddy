'use client';

import { useState } from "react";

export default function Account({ goToNextPage }: { goToNextPage: (page: string, view?: string) => void }) {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [editMode, setEditMode] = useState(false);

  const handleSaveChanges = () => {
    if (userInfo.name && userInfo.email) {
      alert("Account details updated successfully!");
      setEditMode(false);
    } else {
      alert("Please fill in all required fields.");
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
        color: "#fff",
        padding: "20px",
      }}
    >
      {/* Title */}
      <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>Account Settings</h1>
      <p style={{ fontSize: "18px", marginBottom: "30px", textAlign: "center", maxWidth: "500px" }}>
        Update your account information below.
      </p>

      {/* User Info Form */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "16px" }}>
            Name
          </label>
          <input
            type="text"
            value={userInfo.name}
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            disabled={!editMode}
            placeholder="Enter your name"
            style={{
              padding: "10px",
              width: "300px",
              borderRadius: "4px",
              border: editMode ? "1px solid #ccc" : "none",
              backgroundColor: editMode ? "#fff" : "#ddd",
              color: "black",
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "16px" }}>
            Email
          </label>
          <input
            type="email"
            value={userInfo.email}
            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            disabled={!editMode}
            placeholder="Enter your email"
            style={{
              padding: "10px",
              width: "300px",
              borderRadius: "4px",
              border: editMode ? "1px solid #ccc" : "none",
              backgroundColor: editMode ? "#fff" : "#ddd",
              color: "black",
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "16px" }}>
            Password
          </label>
          <input
            type="password"
            value={userInfo.password}
            onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
            disabled={!editMode}
            placeholder="Enter your password"
            style={{
              padding: "10px",
              width: "300px",
              borderRadius: "4px",
              border: editMode ? "1px solid #ccc" : "none",
              backgroundColor: editMode ? "#fff" : "#ddd",
              color: "black",
            }}
          />
        </div>
      </div>

      {/* Edit / Save Buttons */}
      {!editMode ? (
        <button
          onClick={() => setEditMode(true)}
          style={{
            padding: "12px 18px",
            backgroundColor: "#446486",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            marginBottom: "20px",
          }}
        >
          Edit Information
        </button>
      ) : (
        <button
          onClick={handleSaveChanges}
          style={{
            padding: "12px 18px",
            backgroundColor: "#446486",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            marginBottom: "20px",
          }}
        >
          Save Changes
        </button>
      )}

      {/* Back Button */}
      <button
        onClick={() => goToNextPage("calendar", "settings")}
        style={{
          padding: "10px 20px",
          backgroundColor: "#fff",
          color: "#446486",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
          marginTop: "10px",
        }}
      >
        Back
      </button>
    </div>
  );
}
