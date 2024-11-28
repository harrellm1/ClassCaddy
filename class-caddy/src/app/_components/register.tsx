'use client';
import { api } from "~/trpc/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../_components/logo";
export default function Register({goToNextPage}:{goToNextPage:(page:string) => void}) {
  const router = useRouter();
  const studentAdd = api.user.addStudent.useMutation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return(
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#7197C1',
        flexDirection: 'column',
      }}>
        <Logo />
          <h3 style={{ 
            display: 'flex',
            width: '332px', 
            height: '72px', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            flexShrink: 0,
            color: '#F2EFEE',
            marginTop: '80px',
            marginBottom: '10px',
            textAlign: 'center',
            fontSize: '60px',
            fontWeight: 600,
          }}>
            Sign Up
          </h3>
      
          <h4 style={{ 
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
            Welcome! Enter your information below.
          </h4>

          <form
            onSubmit={async(e) => {
              e.preventDefault();
              try{
                await studentAdd.mutateAsync({firstname: firstName, lastname: lastName, email: email, password: password});
                alert("You will now be redirected to log in to your new account");
                goToNextPage("login");
              }
              catch(error){
                alert("User already exists. Please log in instead");
                goToNextPage("login");
              }} 
            }
          >
            <div
              style={{ 
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
              }}
            >
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
                type="text" 
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
                placeholder="Password" 
                onChange={(e) =>setPassword(e.target.value)}
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
                disabled = {studentAdd.isPending}
              >
                {studentAdd.isPending? "Submitting" : "Submit"}
              </button>
                

            </div>
          </form>
    </div>
  )
}