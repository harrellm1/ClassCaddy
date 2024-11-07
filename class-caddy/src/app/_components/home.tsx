"use client";
import { api } from "~/trpc/react";
import {use, useState} from "react";
import Logo from "./logo";
import { set } from "zod";

export default function Login() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassWord] = useState("");
    const [currentPage, setCurrentPage] = useState('home');
    const studentAdd = api.user.addStudent.useMutation();
    const studentDel = api.user.deleteUser.useMutation();
    const [loginStatus, setLoginStatus] = useState(false);
    
    const { data: student, refetch } = api.user.getUser.useQuery(
      { useremail: email, password:password },
      { enabled: false } // Disable the automatic fetching
  );

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log(student);
      // Refetch the user data based on the email
      await refetch();
    
      // Check if user exists
      if (student && student.password === password) {
          // Here you would verify the password
          setCurrentPage('calendar');
      }
      else {
              console.log('Invalid Credentials');
              setLoginStatus(false);
              setPassWord(""); // Reset password on failure
              setEmail("");
          }
      
  };

    return(
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
          <button onClick={() => setCurrentPage("login")} style={{
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

          <button onClick={() => setCurrentPage("register")} style={{
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
            Register
          </button>
        </main>
      )}

      {currentPage === 'login' && (
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
                  Sign In
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
                  {loginStatus ? "Invalid Credentials!":"Enter your credentials below!"}
        
                </h3>
      
                {/* White box for email input */}
                <div style={{ 
                  width: '214px', 
                  height: '175px',
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  padding: '10px',
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                }}>

        <form
            onSubmit={handleLogin}
        >  
                  <input 
                    type="email" 
                    placeholder="Email" 
                    value = {email}
                    onChange={(e) =>setEmail(e.target.value)}
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
                    type="password" 
                    placeholder="password" 
                    value = {password}
                    onChange={(e) =>setPassWord(e.target.value)}
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
                 <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                 type="submit"
                 style={{padding: '10px 20px',
                 cursor: 'pointer',
                 marginTop: '20px',
                 borderRadius: '8px',
                 border: 'none',
                 backgroundColor: '#6EAAEA',
                 color: '#FFF',
                 fontSize: '16px',
                 fontWeight: 'bold',
                 transition: 'background-color 0.3s',}}
                >
                    Log In
                </button>
                  </div>
                    
                </form>
                  </div>
                  
                </div>
      )}

      {currentPage === 'register' && (
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
                  Sign Up
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
                  Welcome! Enter your information below
                </h3>
      
                <form
        // onSubmit={(e) => {
        //   e.preventDefault();
        //   studentAdd.mutate({ firstname:firstName, lastname:lastName, email:email, password:password });
        //   if(studentAdd){
        //     setCurrentPage("calendar");
        //   }

        //   else {
        //     <p>Email connected to existing account. Please log in</p>
        //   }
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await studentAdd.mutateAsync({ firstname: firstName, lastname: lastName, email: email, password: password });
            setCurrentPage("calendar");
          } catch (error) {
            setCurrentPage("login");
            setEmail("");
            setPassWord("");
            console.error("Account creation failed:", error);
            // Optionally, you can set an error state to show a message to the user
          }
        }}>
                
                {/* White box for email input */}
                <div style={{ 
                  width: '214px', 
                  height: '250px',
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
                    onChange={(e) =>setFirstName(e.target.value)}
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
                    onChange={(e) =>setLastName(e.target.value)}
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
                    type="email" 
                    placeholder="Email" 
                    onChange={(e) =>setEmail(e.target.value)}
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
                    type="password" 
                    placeholder="password" 
                    onChange={(e) =>setPassWord(e.target.value)}
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

                <button
                 type="submit"
                className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
                    disabled={studentAdd.isPending}
                >
                    {studentAdd.isPending ? "Submitting..." : "Submit"}
                </button>
      

                  </div>
                </form>
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
          <button onClick={() =>{ 
          setPassWord(""); 
          setEmail("");
          setCurrentPage("home");}}
          
          style={{
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
            Log Out
          </button>
        </div>
      )}
    </div>
    )
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