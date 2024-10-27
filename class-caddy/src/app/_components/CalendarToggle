// src/app/_components/CalendarToggle.tsx
"use client"; // Mark this as a Client Component

import { useState } from "react";

const Calendar = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#FFF' }}>
      <h1 style={{ color: '#000' }}>Calendar</h1>
    </div>
  );
};

const CalendarToggle = () => {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowCalendar(!showCalendar)} 
        style={{ padding: '10px 20px', cursor: 'pointer' }}>
        {showCalendar ? 'Back to Home' : 'Go to Calendar'}
      </button>
      {showCalendar && <Calendar />}
    </>
  );
};

export default CalendarToggle;
