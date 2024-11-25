'use client';

import { useState } from "react";
import Home from "./_components/Home";
import Login from "./_components/Login";
import Calendar from "./_components/Calendar";
import Payment from "./_components/Payment";

export default function Page() {
  const [currentPage, setCurrentPage] = useState("home");

  function goToNextPage(page: string) {
    console.log("Navigating to:", page); // Debug logging
    setCurrentPage(page);
  }

  return (
    <>
      {currentPage === "home" && <Home goToNextPage={goToNextPage} />}
      {currentPage === "login" && <Login goToNextPage={goToNextPage} />}
      {currentPage === "calendar" && <Calendar goToNextPage={goToNextPage} />}
      {currentPage === "payment" && <Payment goToNextPage={goToNextPage} />}
    </>
  );
}
