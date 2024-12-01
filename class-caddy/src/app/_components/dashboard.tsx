'use client';
 import { Student } from "@prisma/client";
import { useState } from "react";

export default function Dashboard ({student, logout, goToNextPage}: {student: Student | null;
    logout: (user:Student) => void;
    goToNextPage:(page:string) => void
}) {
    const [updateTable, setUpdateTable] = useState(false);

    if(!student) {
        goToNextPage('home');
    }
    else{
        return (

            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                backgroundColor: 'white',
                flexDirection: 'column',
              }}
            >
                <button
                    onClick={()=>{logout(student)}}
                    style= {{
                        position: 'fixed',
                        top: '10px',
                        right: '10px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        marginTop: '20px',
                        marginRight: '20px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#6EAAEA',
                        color: '#FFF',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s',
                    }}
                >
                    Log Out



                </button>

                <button 
                    onClick={()=>{goToNextPage("payment")}}
                    style= {{
                        position: 'fixed',
                        top: '60px',
                        right: '10px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        marginTop: '20px',
                        marginRight: '20px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#6EAAEA',
                        color: '#FFF',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s'
                     }}
                >
                        Settings

                </button>
                
                <button
                    onClick={()=>{goToNextPage("courses")}}
                    style= {{
                        position: 'fixed',
                        top: '110px',
                        right: '10px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        marginTop: '20px',
                        marginRight: '20px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#6EAAEA',
                        color: '#FFF',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s'
                    }}
                 >
                    Courses
                </button>

                <button
                    onClick={()=>{goToNextPage("calendar")}}
                    style= {{
                        position: 'fixed',
                        top: '140px',
                        right: '10px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        marginTop: '20px',
                        marginRight: '20px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#6EAAEA',
                        color: '#FFF',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s'
                    }}
                 >
                    Courses
                </button>
                
                

                <h2
                    style = {{
                        position: 'fixed',
                        top: '40px',
                        color: '#7197C1',
                        fontSize: '20px'
                    }}
                > Welcome to your Dashboard, {student.firstName} !</h2>
            </div>
            
        )
    
    }
   
}










