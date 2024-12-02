'use client';

import { useState } from "react";
import { api } from "~/trpc/react";

export default function Worker({ goToNextPage }: { goToNextPage: (page: string) => void }) {
  const [workerId, setWorkerId] = useState("worker-id-123");
  const [editMode, setEditMode] = useState(false);

  // Fetch shifts for a given week
  const { data: shifts, isLoading, isError } = api.workSchedule.getShiftsForWeek.useQuery({ weekId: 1 });

  // Mutation for updating a shift
  const updateShiftMutation = api.workSchedule.createShift.useMutation({
    onSuccess: () => {
      alert("Shift updated successfully!");
      setEditMode(false);
    },
    onError: () => {
      alert("Failed to update shift.");
    },
  });

  const handleSaveChanges = () => {
    if (workerId) {
      updateShiftMutation.mutate({
        jobId: 1, // Assuming jobId and other necessary info are hardcoded for now or should be gathered from the UI
        weekId: 1,
        startTime: new Date(), // Example, replace with actual data
        endTime: new Date(), // Example, replace with actual data
      });
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
      <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>Worker Information</h1>
      <p style={{ fontSize: "18px", marginBottom: "30px", textAlign: "center", maxWidth: "500px" }}>
        Update your worker details below.
      </p>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {/* Worker Info Form */}
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "16px" }}>
            Worker ID
          </label>
          <input
            type="text"
            value={workerId}
            onChange={(e) => setWorkerId(e.target.value)}
            disabled={!editMode}
            placeholder="Enter worker's ID"
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
        {/* Add additional fields as necessary */}
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
        onClick={() => goToNextPage("calendar")}
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
