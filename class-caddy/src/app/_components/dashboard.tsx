'use client';
import { useRouter } from "next/navigation";
import { Student } from "@prisma/client";
import { student } from "~/types/usertype";

interface ChildComponentProps {
    user:Student
}

export default function Dashboard ({student, logout, goToNextPage}: {student: Student | null;
    logout: (user:Student) => void;
    goToNextPage:(page:string) => void
}) {

    if(!student) {
        goToNextPage('home');
    }
    else{
        return (
            <div>
                <h1>welcome to dashboard {student.firstName}</h1>
                <button
                    onClick={()=> logout(student)}
                >
            
                    log out
                </button>
            </div>
        )
    
    }
   
}