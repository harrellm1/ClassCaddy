'use client';

import { Student, Course } from "@prisma/client";
import { api } from "~/trpc/react";
import { useState } from "react";
import { useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ClassSchedule from './classTimes';

export default function Courses({user, goToNextPage}:{user:Student|null,goToNextPage:(page:string)=>void}){
    
    //procedure calls
    const courseAdd = api.course.addCourse.useMutation();
    const getUserCourses = api.course.getCourses.useMutation();


    //form states
    const [openForm, setOpenForm] = useState(false);
    const [courseName, setCourseName] = useState("");
    const [courseInstructor, setCourseInstructor] = useState("");
    const [courseCode, setCoursecode] = useState("");
    const [semester, setSemester] = useState("Spring");
    const [year, setYear] = useState(2025);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [allUserCourses, setAllUserCourses] = useState<Course[]> ([]);
    
   if(!user){
    goToNextPage('home');
   }
   

   else{
        useEffect(() => {
            const getCourses = async () => {
            setLoading(true);
            setError(null);
            try {
                const userCourses = await getUserCourses.mutateAsync(user.email);
                setAllUserCourses(userCourses);
            } catch (err) {
                setError('Failed to load courses');
            } finally {
                setLoading(false);
            }
        };
        if(user) getCourses();
        }, [user]); 
    return(

        <div>
            <button
                style = {{
                    position: 'fixed',
                    top: '20px',
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

                onClick={()=>{goToNextPage('dashboard')}}
            >
                Return to Dashboard
            </button>
            <div
                style= {{
                    position: 'fixed',
                    top: '90px',
                    alignContent: 'center',
                    paddingLeft: '20px',
                    paddingRight: '20px'
                }}
            >
                <h2
                style={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color:  '#7197C1'
                }}>
                    {user.firstName}'s Courses
                </h2>
                <div style={{
                    display: 'flex',
                    
                }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">
                                        Course Code
                                    </TableCell>
                                    <TableCell align="center">
                                        Course Name
                                    </TableCell>
                                    <TableCell align="center">
                                        Instructor
                                    </TableCell>
                                    <TableCell align="center">
                                        Semester
                                    </TableCell>
                                    <TableCell align="center">
                                        Year
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allUserCourses.map((course)=> (
                                    <TableRow key = {course.courseName}>
                                        <TableCell align = 'center'>
                                            {course.courseNumber}
                                        </TableCell>

                                        <TableCell align = 'center'>
                                            {course.courseName}
                                        </TableCell>

                                        <TableCell align = 'center'>
                                            {course.courseInstructor}
                                        </TableCell>

                                        <TableCell align = 'center'>
                                            {course.Semester}
                                        </TableCell>

                                        <TableCell align = 'center'>
                                            {course.Year}
                                        </TableCell>
                                        
                                    </TableRow>

                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                <div
                    style={{
                        marginTop: '20px',
                        
                    }}
                >
                    <button
                        onClick={() => {
                            setOpenForm(true);
                        }}
                        style={{
                                padding: '10px 20px',
                                cursor: 'pointer',
                                marginTop: '20px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#6EAAEA',
                                color: '#FFF',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                transition: 'background-color 0.3s'
                        }}
                    >
                        Add Course 
                    </button>
                </div>

            </div>
            
        {openForm && (
            <div
                style = { {
                    position: 'fixed',  // Make it overlay the screen
                    top: '0',           // Align it to the top of the screen
                    left: '0',          // Align it to the left of the screen
                    width: '100%',      // Make it full width
                    height: '100%',     // Make it full height
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent overlay background
                    display: 'flex',    // Use flexbox to center the form
                    justifyContent: 'center', // Horizontally center the form
                    alignItems: 'center', // Vertically center the form
                    zIndex: '1000',     // Make sure it appears above other content
                  }}>
                    <form
                        style = {{ 
                            backgroundColor: '#7197C1',
                            padding: '20px',
                            borderRadius: '8px', 
                            border: '2px solid #7197C1', 
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                            width: '80%',          
                            position: 'relative',
                            alignContent: 'center'    
                        }}
                        onSubmit={async (e:React.FormEvent) => {
                            e.preventDefault();
                            const newCourse = await courseAdd.mutateAsync({
                                courseName: courseName,
                                courseNumber: courseCode,
                                courseInstructor: courseInstructor,
                                studentEmail: user.email,
                                semester: semester,
                                year: year
                            });

                            if(newCourse){
                                setAllUserCourses((prevCourses) => [...prevCourses, newCourse]);
                            }
                            
                            setCourseInstructor("");
                            setCourseName("");
                            setCoursecode("");
                            setSemester("Spring");
                            setYear(2025);
                            setOpenForm(false);
                        }}
                        
                    >
                        <button
                            style = {{
                                position: 'absolute',  // Position the close button in the top-left corner
                                top: '10px',
                                left: '10px',
                                backgroundColor: 'transparent',  // Make the background transparent
                                color: 'red',  // Red color for the "X"
                                fontSize: '24px', // Size of the "X"
                                border: 'none', // Remove the border
                                cursor: 'pointer',
                            }}
                            onClick= {()=> {setOpenForm(!openForm)}}>
                            X
                        </button>
                        <h3
                        style = {{
                            color: 'white',                // Makes the text color white
                            fontWeight: 'bold',            // Makes the text bold (strong)
                            textAlign: 'center',           // Centers the heading
                            marginBottom: '20px',          // Adds space below the heading
                        }}
                        >
                            Enter Course Details
                        </h3>

                        <input 
                            type="text" 
                            placeholder="Course Name" 
                            value = {courseName}
                            onChange={(e) =>setCourseName(e.target.value)}
                            style={{ 
                                display: 'block',
                                width: '100%', 
                                height: '36.526px', 
                                borderRadius: '5px', 
                                border: '1px solid #ccc', 
                                padding: '5px',
                                marginBottom: '10px', 
                                backgroundColor: 'white',
                            }} 
                        />

                        <input 
                            type="text" 
                            placeholder="Course Code" 
                            value = {courseCode}
                            onChange={(e) =>setCoursecode(e.target.value)}
                            style={{ 
                                display: 'block',
                                width: '100%', 
                                height: '36.526px', 
                                borderRadius: '5px', 
                                border: '1px solid #ccc', 
                                padding: '5px',
                                marginBottom: '10px', 
                                backgroundColor: 'white',
                            }} 
                        />

                        <input 
                            type="text" 
                            placeholder="Instructor" 
                            value = {courseInstructor}
                            onChange={(e) =>setCourseInstructor(e.target.value)}
                            style={{ 
                            display: 'block',
                            width: '100%', 
                            height: '36.526px', 
                            borderRadius: '5px', 
                            border: '1px solid #ccc', 
                            padding: '5px',
                            marginBottom: '10px', 
                            backgroundColor: 'white',
                            }} 
                        />

                        <div style={{
                            backgroundColor: 'white',
                            border: '2px solid white'
                        }}>
                            <label style = {{
                                color: '#7D7F7C'
                            }}>
                                Select semester: 
                                <select 
                                value={semester}
                                onChange={(e)=>setSemester(e.target.value)}
                                style={{
                                    padding: '5px',
                                    marginLeft: '10px',
                                    backgroundColor: 'white',
                                    border: '1px solid black',
                                    color: '#7D7F7C',
                                
                                }}>
                                    <option value="Spring">Spring</option>
                                    <option value="Fall">Fall</option>
                                    <option value="Summer">Summer</option>
                                </select>
                            </label>

                            <label style = {{
                                color: '#7D7F7C',
                                marginLeft: '10px'
                            }}>
                                Select year: 
                                <select 
                                value={year}
                                onChange={(e)=>setYear(Number(e.target.value))}
                                style={{
                                    padding: '5px',
                                    marginLeft: '10px',
                                    backgroundColor: 'white',
                                    border: '1px solid black',
                                    color: '#7D7F7C',
                                
                                }}>
                                    <option value={2025}>2025</option>
                                    <option value={2026}>2026</option>
                                    <option value={2027}>2027</option>
                                    <option value={2028}>2028</option>
                                </select>
                            </label>
                        </div>

                        <button
                        type = 'submit'
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
                            Submit
                        </button>
                    </form>
                </div>

                )
        }

        <div>
            <ClassSchedule user={user}/>
        </div>
        
    </div>
    )}
}