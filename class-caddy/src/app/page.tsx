"use client"; // Marking this file as a Client Component

import { useState } from "react";
import Logo from "~/app/_components/logo"; // Import the Logo component

export default function Home() {
  const [showCalendar, setShowCalendar] = useState(false); // State to toggle views

  const handleCalendarClick = () => {
    setShowCalendar(true); // Switch to calendar view
  };

  const handleHomeClick = () => {
    setShowCalendar(false); // Switch back to home view
  };

  return (
    <div style={{ height: '100vh', margin: 0, padding: 0 }}>
      {showCalendar ? (
        <div style={{ 
          height: '100%', 
          backgroundColor: '#446486', // Full background color for calendar
          position: 'relative' 
        }}>
          {/* Rectangle taking up 3/4 of the page from the bottom */}
          <div style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            width: '100%', 
            height: '75%', 
            backgroundColor: '#7197C1', 
            borderTopLeftRadius: '35px', // Rounded corners at the top
            borderTopRightRadius: '35px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <h1 style={{ color: '#000' }}>Calendar</h1>
          </div>
          {/* Button to switch back to the Home view */}
          <button onClick={handleHomeClick} style={{ 
            padding: '10px 20px', 
            cursor: 'pointer', 
            position: 'absolute', 
            top: '20px', 
            right: '20px', 
            borderRadius: '8px', 
            border: 'none', 
            backgroundColor: '#E0F3FF', 
            color: '#446486', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            transition: 'background-color 0.3s',
          }}>
            Back to Home
          </button>
        </div>
      ) : (
        <main
          style={{
            display: 'flex',
            flexDirection: 'column', // Align items in a column
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#7197C1', // Background color for home
            fontFamily: 'sans-serif',
          }}
        >
          <Logo /> {/* Add the Logo component here */}
          <h1
            style={{
              margin: '20px 0 0', // Added margin for spacing
              color: '#FFF', // Set text color to white
              letterSpacing: '2.5px', // Adjust letter spacing as needed
            }}
          >
            UFLORIDA
          </h1>
          {/* Button to switch to the Calendar view */}
          <button onClick={handleCalendarClick} style={{ 
            padding: '10px 20px', 
            cursor: 'pointer', 
            marginTop: '20px',
            borderRadius: '8px', // Rounded corners
            border: 'none', // No border
            backgroundColor: '#6EAAEA',
            color: '#FFF', // White text
            fontSize: '16px', // Font size
            fontWeight: 'bold', // Bold text
            transition: 'background-color 0.3s', // Smooth transition
          }}>
            Log In
          </button>
        </main>
      )}
    </div>
  );
}
