import { useState } from "react";

export default function Login({ goToNextPage }: { goToNextPage: (page: string) => void }) {
  const [currentPage, setCurrentPage] = useState("login1");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentType, setStudentType] = useState("");

  function handleNextPage(nextPage: string) {
    setCurrentPage(nextPage);
  }

  return (
    <>
      {currentPage === "login1" && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#7197C1',
            flexDirection: 'column',
          }}
        >
          <h2 style={{
            color: '#FFFFFF',
            fontSize: '60px',
            fontWeight: 600,
            marginBottom: '10px',
            textAlign: 'center',
          }}>
            Register
          </h2>
          <h3 style={{
            color: '#FFFFFF',
            marginBottom: '10px',
            textAlign: 'center',
          }}>
            Enter a valid email address
          </h3>
          <div style={{
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '184.224px',
                marginBottom: '10px',
                padding: '5px',
                backgroundColor: '#D9D9D9',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            />
            <button onClick={() => handleNextPage("login2")} style={{
              width: '184.224px',
              padding: '10px',
              backgroundColor: '#6EAAEA',
              color: '#FFF',
              borderRadius: '5px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}>
              Continue
            </button>
          </div>
        </div>
      )}

      {currentPage === "login2" && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#7197C1',
            flexDirection: 'column',
          }}
        >
          <h2 style={{
            color: '#FFFFFF',
            fontSize: '60px',
            fontWeight: 600,
            marginBottom: '10px',
            textAlign: 'center',
          }}>
            Password
          </h2>
          <h3 style={{
            color: '#F2EFEE',
            marginBottom: '10px',
            textAlign: 'center',
          }}>
            Create a password
          </h3>
          <div style={{
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '184.224px',
                marginBottom: '10px',
                padding: '5px',
                backgroundColor: '#D9D9D9',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            />
            <button onClick={() => handleNextPage("login3")} style={{
              width: '184.224px',
              padding: '10px',
              backgroundColor: '#6EAAEA',
              color: '#FFF',
              borderRadius: '5px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}>
              Continue
            </button>
          </div>
        </div>
      )}

      {currentPage === "login3" && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#7197C1',
            flexDirection: 'column',
          }}
        >
          <h2 style={{
            color: '#F2EFEE',
            fontSize: '60px',
            fontWeight: 600,
            marginBottom: '10px',
            textAlign: 'center',
          }}>
            Personal
          </h2>
          <h3 style={{
            color: '#F2EFEE',
            marginBottom: '10px',
            textAlign: 'center',
          }}>
            Fill out your information
          </h3>
          <div style={{
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
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{
                width: '184.224px',
                marginBottom: '10px',
                padding: '5px',
                backgroundColor: '#D9D9D9',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{
                width: '184.224px',
                marginBottom: '10px',
                padding: '5px',
                backgroundColor: '#D9D9D9',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            />
            <select
              value={studentType}
              onChange={(e) => setStudentType(e.target.value)}
              style={{
                width: '184.224px',
                marginBottom: '10px',
                padding: '5px',
                backgroundColor: '#D9D9D9',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            >
              <option value="" disabled>Select Student Type</option>
              <option value="fulltime">Full-Time</option>
              <option value="working">Working</option>
              <option value="athlete">Athlete</option>
            </select>
            <button onClick={() => goToNextPage("calendar")} style={{
              width: '184.224px',
              padding: '10px',
              backgroundColor: '#6EAAEA',
              color: '#FFF',
              borderRadius: '5px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}>
              Complete
            </button>
          </div>
        </div>
      )}
    </>
  );
}
