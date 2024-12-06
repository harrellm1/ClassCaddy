'use client';
import { Student } from "@prisma/client";
import Login from "./_components/login";
import { useState } from "react";
import Payment from "./_components/payment";
import HomeComponent from "./_components/home";
import Register from "./_components/register";
import Account from "./_components/account";
import WorkDashboard from "./_components/workDashboard";
import AthleteDashboard from "./_components/athleteDashboard";
import MainDashboard from "./_components/mainDashboard";
export default function Page() {

  //global user passed and used for authorization
  const [user, setUser] = useState<Student | null>(null);

  const login = (user: Student) => {
    setUser(user);
  }
  const logOut = () => {
    setUser(null);
  }

  //sets page in application
  const [currentPage, setCurrentPage] = useState("home");

  //used for page navigation in app
  function goToNextPage(page: string) {
    console.log("Navigating to:", page); // Debug logging
    setCurrentPage(page);
  }



  return (
    <>
      {currentPage === 'home' && <HomeComponent goToNextPage={goToNextPage} />}
      {currentPage === 'settings' && <Account user={user} goToNextPage={goToNextPage} />}
      {currentPage === 'login' && <Login login={login} goToNextPage={goToNextPage} />}
      {currentPage === 'register' && <Register goToNextPage={goToNextPage} />}
      {currentPage === 'payment' && <Payment user={user} goToNextPage={goToNextPage} />}
      {currentPage === 'main dashboard' && <MainDashboard user={user} logOut={logOut} goToNextPage={goToNextPage} />}
      {currentPage === "work" && <WorkDashboard user={user} goToNextPage={goToNextPage} />}
      {currentPage === "athletics" && <AthleteDashboard user={user} goToNextPage={goToNextPage} />}
    </>
  )

}