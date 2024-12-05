'use client';
import { Student } from "@prisma/client";
import { useEffect } from "react";
import { useState } from "react";
import { api } from "~/trpc/react";
export default function Account({ user, goToNextPage }: { user:Student | null, goToNextPage: (page: string, view?: string) => void }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [studentType, setStudentType] = useState("");

    const editUser = api.user.editUser.useMutation();
    const getUser = api.user.getUser.useMutation();

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const retrieveUser = async () => {
      if(user){
        const foundUser = await getUser.mutateAsync({useremail: user.email,
          password: user.password
        })

        if(foundUser) {
          setFirstName(foundUser.firstName);
          setLastName(foundUser.lastName);
          setEmail(foundUser.email);
          setPassword(foundUser.password);
        }
        
      }
      

    };
    if(user) retrieveUser();
}, [user]);


  async function handleSaveChanges(){

    if(user) {
        const changedUser = await editUser.mutateAsync({
            email: user.email,
            firstname: firstName,
            lastname: lastName,
            password: password  
        });

        goToNextPage('calendar');
    
        if(!changedUser) {
            alert("fill out all fields")
            setFirstName("");
            setLastName("");
            setPassword("");
        }
    }
   
  }

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
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
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
            Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={!editMode}
            placeholder="Enter last Name"
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        {/* Select Student Type */}
        <div style={{ marginBottom: "10px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "16px",
            }}
          >
            Student Type
          </label>
          <select
            value={studentType}
            onChange={(e) => setStudentType(e.target.value)}
            disabled={!editMode}
            style={{
              width: "300px",
              height: "45px",
              padding: "10px",
              borderRadius: "4px",
              border: editMode ? "1px solid #ccc" : "none",
              backgroundColor: editMode ? "#fff" : "#ddd",
              color: editMode ? "black" : "#666",
              cursor: editMode ? "pointer" : "not-allowed",
              fontSize: "16px",
              textAlign: "left",
              appearance: "none", // Hides default browser styles for dropdowns
            }}
          >
            <option value="" disabled style={{ color: "#aaa" }}>
              Select
            </option>
            <option value="fulltime">Full-Time</option>
            <option value="working">Working</option>
            <option value="athlete">Athlete</option>
          </select>
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

      {/* Premium Button */}
      <button
        onClick={() => goToNextPage("payment")}
        style={{
          padding: "10px 20px",
          backgroundColor: "#DDA600",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
          marginBottom: "20px",
        }}
      >
        Try Premium
      </button>

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
        }}
      >
        Back
      </button>
    </div>
  );
}