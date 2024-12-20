'use client';
import { useState } from "react";
import Logo from "../_components/logo";
import { Student } from "@prisma/client";
import { api } from "~/trpc/react";
export default function Login({ login, goToNextPage }: { login: (user: Student) => void; goToNextPage: (page: string) => void }) {

  //input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const studentSignIn = api.user.signIn.useMutation();


  const handleLogin = async (e: React.FormEvent) => {
    const student = await studentSignIn.mutateAsync({ useremail: email, password: password });

    if (student) {
      login(student);
      console.log("logged in student: ", student);
      goToNextPage("main dashboard"); // Navigate to the Calendar page

    }

    else {
      alert('invalid crednetials');
      setEmail("");
      setPassword("");
    }


  };

  return (
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
      <Logo />
      <h2
        style={{
          display: 'flex',
          width: '332px',
          height: '72px',
          flexDirection: 'column',
          justifyContent: 'center',
          flexShrink: 0,
          color: '#FFFFFF',
          marginTop: '50px',
          marginBottom: '10px',
          textAlign: 'center',
          fontSize: '60px',
          fontWeight: 600,
        }}
      >
        Sign In
      </h2>

      <div
        style={{
          width: '210px',
          height: '160px',
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <form
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            handleLogin(e);
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '190px',
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '190px',
              height: '36.526px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              padding: '5px',
              marginBottom: '5px',
              backgroundColor: '#D9D9D9',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                marginTop: '5px',
                width: '190px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#6EAAEA',
                color: '#FFF',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'background-color 0.3s',
              }}
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
