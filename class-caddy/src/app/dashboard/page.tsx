'use client';
import { useRouter } from "next/navigation";
import { Student } from "@prisma/client";
import { useEffect } from "react";

interface ChildComponentProps {
    user:Student
}


const Dashboard: React.FC<ChildComponentProps> = ({user}) => {
    const router = useRouter();
    if(!user) {
        alert("user not logged in!");
        router.push('/login');
    }
    return (
        <div>
            <h1>Welcome to dashboard, {user.firstName}</h1>
        </div>
    )
}

export default Dashboard;