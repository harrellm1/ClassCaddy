// 'use client'
// import React, {useEffect, useState} from 'react';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import { Course, Student } from '@prisma/client';
// import { api } from '~/trpc/react';
// import { ClassTime } from '@prisma/client';
// import { number } from 'zod';
// const daysOfWeekString = [
//     'Monday', 
//     'Tuesday', 
//     'Wednesday', 
//     'Thursday', 
//     'Friday', 
//     'Saturday'];
// const daysOfWeekNum = [
//     0,
//     1,
//     2,
//     3,
//     4,
//     5,
//     6
// ]
// const classPeriods = [
//     'P1 7:25 AM - 8:15 AM',
//     'P2 8:30 AM - 9:20 AM',
//     'P3 9:35 AM - 10:25 AM',
//     'P4 10:40 AM - 11:30 AM',
//     'P5 11:45 AM - 12:35 PM',
//     'P6 12:50 PM - 1:40 PM',
//     'P7 1:55 PM - 2:45 PM',
//     'P8 3:00 PM - 3:50 PM',
//     'P9 4:05 PM - 4:55 PM',
//     'P10 5:10 PM - 6:00 PM',
//     'P11 6:15 PM - 7:05 PM',
//     'E1 7:20 PM - 8:10 PM',
//     'E2 8:20 PM - 9:10 PM',
//     'E3 9:20 PM - 10:10 PM',
// ]

// export default async function ClassSchedule({courses}:{courses: Course[]}) {
//     const classTimes = api.class.getClassesDay.useMutation();
    
//     const [classTimesMonday,setClassTimesMonday] = useState<ClassTime[]> ([]);
//     const [classTimesTuesday,setClassTimesTuesday] = useState<ClassTime[]> ([]);
//     const [classTimesWednesday,setClassTimesWednesday] = useState<ClassTime[]> ([]);
//     const [classTimesThursday,setClassTimesThursday] = useState<ClassTime[]> ([]);
//     const [classTimesFriday,setClassTimesFriday] = useState<ClassTime[]> ([]);

//     useEffect(()=> {
//         const fecthClassTimes = async() => {
//             const classTimesArray: ClassTime[] = [];

//             for(const course of courses) {
//                 const classTime = await classTimes.mutateAsync({
//                     courseId: course.id,
//                     day:1
//                 });

//                 if(classTime) {
//                     for( const time of classTime) {
//                         if(time) {
//                             classTimesArray.push(time);
//                         }
//                     }
//                 }
//             }

//            setClassTimesMonday(classTimesArray);

//         };
//         fecthClassTimes();
//     }, [courses, classTimes]);
 

//     return(
//         <div>
//             <h1> Class Schedule </h1>

//             <TableContainer component={Paper}>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell />
//                                 {daysOfWeekString.map((day) => (
//                                     <TableCell key={day} align="center">
//                                         {day}
//                                     </TableCell>
//                                 ))}
//                         </TableRow>
//                     </TableHead>

//                     <TableBody>
//                         {/*Time Slots*/}
//                         {classPeriods.map((time) => (
//                          <TableRow key={time}>
//                             <TableCell>{time}</TableCell>
//                             <TableCell>
//                                 {
//                                     classTimesMonday.filter
//                                 }
//                             </TableCell>
//                             {/* {daysOfWeekNum.map((day) => (
//                                 courses.map(async (course)=> (
                                  

//                                 ))
//                             ))}
//                              */}


//                          </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>



//             </TableContainer>
//         </div>
//     )
// }


'use client';
import { api } from "~/trpc/react";
import { Course, Student } from "@prisma/client";
import React, {useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ClassTime } from "@prisma/client";
import { Class } from "node_modules/superjson/dist/types";


const periods = [
    1,
    2,
    3,
    4,
    5,
    6, 
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14
]



function periodTime(period: number) {
    if(period === 1) {
        return ('7:25 AM - 8:15 AM')
    }

    if (period === 2) {
        return ('8:30 AM - 9:20 AM')
    }

    if(period === 3) {
        return ('9:35 AM - 10:25 AM')
    }

    if (period === 4) {
        return ('10:40 AM - 11:30 AM')
    }

    if(period === 5) {
        return ('11:45 AM - 12:35 PM')
    }

    if (period === 6) {
        return ('12:50 PM - 1:40 PM')
    }

    if(period === 7) {
        return ('1:55 PM - 2:45 PM')
    }

    if (period === 8) {
        return ('3:00 PM - 3:50 PM')
    }

    if(period === 9) {
        return ('4:05 PM - 4:55 PM')
    }

    if (period === 10) {
        return ('5:10 PM - 6:00 PM')
    }

    if(period === 11) {
        return ('6:15 PM - 7:05 PM')
    }

    if (period === 12) {
        return ('7:20 PM - 8:10 PM')
    }

    if(period === 13) {
        return ('8:20 PM - 9:10 PM')
    }

    if (period === 14) {
        return ('9:20 PM - 10:10 PM')
    }
}

const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
]

export default function ClassSchedule({user}: {user: Student}) {
    const courseCode = api.course.getCourseName.useMutation();
    const classTimes = api.class.getAllClasses.useMutation();
    const [userClasses, setUserClasses] = useState<ClassTime[]> ([]);


    useEffect(() => {
        const getClasses = async() => {
            const classes = await classTimes.mutateAsync(user.email);
            setUserClasses(classes);
        }

    }, [userClasses])

    async function getCourseCode(courseId: string) {
        const courseNum = await courseCode.mutateAsync(
            courseId
        );
    
        return courseNum;
        
    
    }

    // async function getClasses() {
    //     const mondayClasses = await classTimes.mutateAsync({
    //         email: user.email,
    //         day: 1
    //     })
    
    //     const tuesdayClasses = await classTimes.mutateAsync({
    //         email: user.email,
    //         day: 2
    //     })
    
    //     const wednesdayClasses = await classTimes.mutateAsync({
    //         email: user.email,
    //         day: 3
    //     })
    
    //     const thurdayClasses = await classTimes.mutateAsync({
    //         email: user.email,
    //         day: 4
    //     })
    
    //     const fridayClasses = await classTimes.mutateAsync({
    //         email: user.email,
    //         day: 5
    //     })
    
    //     mondayClasses.map((mondayClass)=> {
    //         userClasses.push(mondayClass);
    //     });
    
    //     tuesdayClasses.map((tuesdayClass) => {
    //         userClasses.push(tuesdayClass);
    //     })
    
    //     wednesdayClasses.map((wednesdayClass) => {
    //         userClasses.push(wednesdayClass);
    //     })
    
    //     thurdayClasses.map((thursdayClass) => {
    //         userClasses.push(thursdayClass);
    //     })
    
    //     fridayClasses.map((fridayClass) => {
    //         userClasses.push(fridayClass);
    //     })
    // }
    


    return(
        <div>
            <h1> Class Schedule </h1>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                                {daysOfWeek.map((day) => (
                                    <TableCell key={day} align="center">
                                        {day}
                                    </TableCell>
                                ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {/*Time Slots*/}
                        {periods.map((time) => (
                         <TableRow key={time}>
                            <TableCell>{periodTime(time)}</TableCell>
                            <TableCell>
                                {userClasses.filter((classTime) => classTime.Period === time) // Filter by period
                                    .map((filteredClassTime) => (
                                        <div key={filteredClassTime.id}>
                                            {getCourseCode(filteredClassTime.courseId)}
                                        </div>
                                    ))}
                                    
    
                            </TableCell>



                         </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </div>
   ) 
}

