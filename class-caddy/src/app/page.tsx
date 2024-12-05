// import {HydrateClient } from "~/trpc/server";
// import HomeComponent from "./_components/home";
// import Login from "./_components/login";
// import Dashboard from "./_components/dashboard";
// export default async function Home(){

//   return (
//     <HydrateClient>
//       <main >
//         <div>
//           <HomeComponent />
//         </div>
//       </main>
//     </HydrateClient>
//   );
// }


'use client';
import { Student} from "@prisma/client";
import Login from "./_components/login";
import { useState } from "react";
import Payment from "./_components/payment";
import HomeComponent from "./_components/home";
import Dashboard from "./_components/dashboard";
import Register from "./_components/register";
import Courses from "./_components/courses";
import CalendarApp from "./_components/calendar";
import Account from "./_components/account";
import WorkDashboard from "./_components/workdashboard";
export default function Page() {
  const [user, setUser] = useState<Student | null> (null);
  const [currentPage, setCurrentPage] = useState("home");
  const login = (user:Student) => {
    setUser(user);
  }
  const logOut = () =>{
    setUser(null);
  }
  function goToNextPage(page: string) {
    console.log("Navigating to:", page); // Debug logging
    setCurrentPage(page);
  }
  
  

  return(
    <>
      {currentPage === 'home' && <HomeComponent goToNextPage={goToNextPage}/>}
      {currentPage === 'settings' && <Account user = {user} goToNextPage= {goToNextPage}/>}
      {currentPage === 'login' && <Login login = {login}  goToNextPage = {goToNextPage}/>}
      {currentPage === 'dashboard' && <Dashboard logout = {logOut} student = {user} goToNextPage={goToNextPage}/>}
      {currentPage === 'register' && <Register goToNextPage={goToNextPage}/>}
      {currentPage === 'payment' && <Payment user = {user} goToNextPage={goToNextPage} />}
      {currentPage === 'courses' && <Courses user={user} goToNextPage={goToNextPage}/>}
      {currentPage === 'calendar' && <CalendarApp user={user} logOut = {logOut} goToNextPage={goToNextPage} />}  
      {currentPage==="work" && <WorkDashboard user={user} goToNextPage={goToNextPage}/>}
    </>
  )

}