'use client';
import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import Logo from "../_components/logo";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const studentSearch= api.user.getUser.useMutation();
    const router = useRouter();
    return(
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            backgroundColor: '#7197C1',
            flexDirection: 'column',
          }}
        >
            <Logo/>
            <h2 style={{ 
                display: 'flex',
                width: '332px', 
                height: '72px', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                flexShrink: 0,
                color: '#F2EFEE',
                marginTop:'80px',
                marginBottom: '10px',
                textAlign: 'center',
                fontSize: '60px',
                fontWeight: 600,
            }}>
                Sign In
            </h2>

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
                    onSubmit={async(e:React.FormEvent) => {
                        e.preventDefault();
                        const student = await studentSearch.mutateAsync({useremail:email, password:password});
                        
                        try{                       
                            console.log(studentSearch);
                        if(student) {
                            if (student.password == password){
                                router.push('/dashboard');
                            }
                            else{
                                alert('Invalid credentials');
                                setEmail("");
                                setPassword("");
                            }                      
                        }
                        else {
                            alert("User does not exist");
                            router.push('/register');
                        }
                        }
                        catch(error){
                            console.log("Error during login: ", error);

                        }

                    }}
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
    )
}