"use client";

import { useState } from "react";
import Logo from "~/app/_components/logo";

export default function Home() {
  const [currentPage, setCurrentPage] = useState("home");

  const goToNextPage = (nextPage: string) => {
    setCurrentPage(nextPage);
  };

  return (
    <div style={{ height: '100vh', margin: 0, padding: 0 }}>
      {currentPage === "home" && (
        <main
          style={{
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#7197C1',
            fontFamily: 'sans-serif',
          }}
        >
          <Logo />
          <h1 style={{ margin: '20px 0 0', color: '#FFF', letterSpacing: '2.5px' }}>
            UFLORIDA
          </h1>
          <button onClick={() => goToNextPage("login1")} style={{
            padding: '10px 20px',
            cursor: 'pointer',
            marginTop: '20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#6EAAEA',
            color: '#FFF',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
          }}>
            Log In
          </button>
        </main>
      )}

      {currentPage === "login1" && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          backgroundColor: '#7197C1',
          flexDirection: 'column',
        }}>
          {/* Styled header outside the white box, centered */}
          <h2 style={{ 
            display: 'flex',
            width: '332px', 
            height: '72px', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            flexShrink: 0,
            color: '#F2EFEE',
            marginBottom: '10px',
            textAlign: 'center',
            fontSize: '60px',
            fontWeight: 600,
          }}>
            Register
          </h2>

          <h3 style={{ 
            display: 'flex',
            width: '337px', 
            height: '22.46px', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            flexShrink: 0,
            color: '#F2EFEE',
            marginBottom: '10px',
            textAlign: 'center',
          }}>
            Enter a valid email address
          </h3>

          {/* White box for email input */}
          <div style={{ 
            width: '214px', 
            height: '120px',
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '10px',
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
          }}>
            <input 
              type="email" 
              placeholder="Email" 
              style={{ 
                width: '184.224px', 
                height: '36.526px', 
                borderRadius: '5px', 
                border: '1px solid #ccc', 
                padding: '5px',
                marginBottom: '10px', 
                backgroundColor: '#D9D9D9',
              }} 
            />
            <button onClick={() => goToNextPage("login2")} style={{
              width: '184.224px',
              height: '36.526px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: '#6EAAEA',
              color: '#FFF',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}>
              Continue
            </button>
          </div>
        </div>
      )}

{currentPage === "login2" && (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    backgroundColor: '#7197C1',
    flexDirection: 'column',
  }}>
    {/* Styled header outside the white box, centered */}
    <h2 style={{ 
      display: 'flex',
      width: '332px', 
      height: '72px', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      flexShrink: 0,
      color: '#F2EFEE',
      marginBottom: '10px',
      textAlign: 'center',
      fontSize: '60px',
      fontWeight: 600,
    }}>
      Password
    </h2>

    <h3 style={{ 
      display: 'flex', 
      width: '337px', 
      height: '22.46px', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      flexShrink: 0,
      color: '#F2EFEE',
      marginBottom: '10px', 
      textAlign: 'center', 
    }}>
      Create a password
    </h3>

    {/* White box for password input */}
    <div style={{ 
      width: '214px', 
      height: '120px',
      backgroundColor: 'white', 
      borderRadius: '8px', 
      padding: '10px',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', 
    }}>
      <input 
        type="password" 
        placeholder="Password" 
        style={{ 
          width: '184.224px', 
          height: '36.526px', 
          borderRadius: '5px', 
          border: '1px solid #ccc', 
          padding: '5px',
          marginBottom: '10px', 
          backgroundColor: '#D9D9D9',
        }} 
      />
      <button onClick={() => goToNextPage("login3")} style={{
        width: '184.224px',
        height: '36.526px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#6EAAEA',
        color: '#FFF',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
      }}>
        Continue
      </button>
    </div>
  </div>
)}


{currentPage === "login3" && (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    backgroundColor: '#7197C1',
    flexDirection: 'column',
  }}>
    {/* Styled header outside the white box, centered */}
    <h2 style={{ 
      display: 'flex', 
      width: '332px', 
      height: '72px', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      flexShrink: 0,
      color: '#F2EFEE',
      marginBottom: '10px',
      textAlign: 'center', 
      fontSize: '60px', 
      fontWeight: 600,
    }}>
      Personal
    </h2>

    <h3 style={{ 
      display: 'flex', 
      width: '337px', 
      height: '22.46px', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      flexShrink: 0,
      color: '#F2EFEE', 
      marginBottom: '10px', 
      textAlign: 'center', 
    }}>
      Fill out your information
    </h3>

    {/* White box for details input */}
    <div style={{ 
      width: '220px', 
      height: '219px',
      backgroundColor: 'white', 
      borderRadius: '8px', 
      padding: '10px',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', 
    }}>
      <input 
        type="text" 
        placeholder="First Name" 
        style={{ 
          width: '184.224px', 
          height: '36.526px', 
          borderRadius: '5px', 
          border: '1px solid #ccc', 
          padding: '5px',
          marginBottom: '10px', 
          backgroundColor: '#D9D9D9', 
        }} 
      />
      <input 
        type="text" 
        placeholder="Last Name" 
        style={{ 
          width: '184.224px', 
          height: '36.526px', 
          borderRadius: '5px', 
          border: '1px solid #ccc', 
          padding: '5px',
          marginBottom: '10px', 
          backgroundColor: '#D9D9D9', 
        }} 
      />
      <select style={{ 
        width: '184.224px', 
        height: '36.526px', 
        borderRadius: '5px', 
        border: '1px solid #ccc', 
        marginBottom: '10px',
        backgroundColor: '#D9D9D9', 
      }}>
        <option value="" disabled selected>Select Student Type</option>
        <option value="fulltime">Full-Time</option>
        <option value="working">Working</option>
        <option value="athlete">Athlete</option>
      </select>
      <button onClick={() => goToNextPage("calendar")} style={{
        width: '184.224px',
        height: '36.526px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#6EAAEA',
        color: '#FFF',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
      }}>
        Complete
      </button>
    </div>
  </div>
)}

      {currentPage === "calendar" && (
        <div style={{ height: '100%', backgroundColor: '#446486', position: 'relative' }}>
          <div style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            width: '100%', 
            height: '75%', 
            backgroundColor: '#7197C1', 
            borderTopLeftRadius: '35px', 
            borderTopRightRadius: '35px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <h1 style={{ color: '#000' }}>Calendar</h1>
          </div>
          <button onClick={() => goToNextPage("home")} style={{
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
      )}
    </div>
  );
}

const loginPageStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#7197C1',
};

const inputStyle = {
  padding: '10px',
  margin: '10px 0',
  width: '80%',
  borderRadius: '8px',
  border: '1px solid #DDD',
  fontSize: '16px',
};

const continueButtonStyle = {
  padding: '10px 20px',
  cursor: 'pointer',
  marginTop: '20px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#6EAAEA',
  color: '#FFF',
  fontSize: '16px',
  fontWeight: 'bold',
  transition: 'background-color 0.3s',
};
