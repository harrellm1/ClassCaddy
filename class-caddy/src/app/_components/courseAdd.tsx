"use client";
import { useState } from "react";
import { api } from "~/trpc/react";
interface studentInfo {
    email: string;
    passWord:string;
  }
export default function CourseAdd(){
  const studentAdd = api.course.addCourse.useMutation();


    return (
      <div style={{ height: '100vh', margin: 0, padding: 0 }}>
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
        ></main>

        <button>
          Add Course
        </button>
        </div>
    )

}