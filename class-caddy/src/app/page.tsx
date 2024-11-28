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
import HomeComponent from "./_components/home";
import Dashboard from "./_components/dashboard";
import { student } from "~/types/usertype";
import Register from "./_components/register";
export default function Page() {
  const [user, setUser] = useState<Student | null> (null);
  const [currentPage, setCurrentPage] = useState("home");
  const dummyStudent:Student = {
    id: 'fakeuser',
    firstName: 'dummy',
    lastName: 'dumdum',
    email: 'dummy.data@dummy.com',
    password:'dummydumum',
    paidPlan: false,
    nextPayment: null
  }
  const login = (user:Student) => {
    setUser(user);
  }
  function goToNextPage(page: string) {
    console.log("Navigating to:", page); // Debug logging
    setCurrentPage(page);
  }
  
  function logOut(student:Student | null) {
    console.log(student);
    student = null;
    console.log("student should be null! ", student);
    setUser(student);
    goToNextPage("home");
  }

  return(
    <>
      {currentPage === 'home' && <HomeComponent goToNextPage={goToNextPage}/>}
      {currentPage === 'login' && <Login login = {login}  goToNextPage = {goToNextPage}/>}
      {currentPage === 'dashboard' && <Dashboard logout = {logOut} student = {user} goToNextPage={goToNextPage}/>}
      {currentPage === 'register' && <Register goToNextPage={goToNextPage}/>}
    </>
  )

}