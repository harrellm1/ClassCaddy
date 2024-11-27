'use client';

import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Dashboard({ goToNextPage }: { goToNextPage: (page: string) => void }) {
  return (
    <div style={{ backgroundColor: "#446486", height: "100vh", padding: "20px", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "15px",
          left: "20px",
          padding: "12px 18px",
          fontSize: "46px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent",
          borderRadius: "8px",
          width: "130px",
          height: "130px",
        }}
        onClick={() => goToNextPage("calendar")}
      >
        📅
      </div>

      <div style={{ marginBottom: "20px", marginTop: "80px", display: "flex", justifyContent: "center", width: "100%" }}>
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next,today",
            center: "title",
            right: "timeGridWeek,timeGridDay",
          }}
          events={[]}
          nowIndicator={true}
          editable={true}
          droppable={true}
          selectable={true}
          selectMirror={true}
          dateClick={(info) => console.log("Date clicked:", info.dateStr)}
          drop={(info) => console.log("Event dropped:", info)}
          height="200px"
        />
      </div>

      <div
        style={{
          backgroundColor: "#7197C1",
          height: "58.5%",
          width: "100%",
          borderRadius: "40px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          color: "white",
          fontSize: "24px",
          padding: "20px",
          marginLeft: "10px",
        }}
      >
        Coming Up
      </div>
    </div>
  );
}
