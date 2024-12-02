'use client';

import { useState } from "react";
import Home from "./_components/Home";
import Login from "./_components/Login";
import Calendar from "./_components/Calendar";
import Payment from "./_components/Payment";
import Account from "./_components/Account";
import Dashboard from "./_components/Dashboard";
{/*import Dashboard_A from "./_components/Dashboard_A";
import Dashboard_W from "./_components/Dashboard_W";*/}

export default function Page() {
  const [currentPage, setCurrentPage] = useState("home");

  function goToNextPage(page: string) {
    console.log("Navigating to:", page); // Debug logging
    setCurrentPage(page);
  }

  return (
    <>
      {currentPage !== "home" && currentPage !== "login" && (
        <nav className="flex justify-end items-center w-full px-4 bg-[#7197C1]">
          <div className="flex space-x-4 space-y-2">
            {/*<button 
              className="text-white bg-[#2a3a50] hover:bg-[#DDA600] px-4 py-2 mt-2 rounded-md"
              onClick={() => goToNextPage("dashboard_w")}
            >
              Dashboard Work
            </button>
            <button 
              className="text-white bg-[#2a3a50] hover:bg-[#DDA600] px-4 py-2 mt-2 rounded-md"
              onClick={() => goToNextPage("dashboard_a")}
            >
              Dashboard Athlete
            </button>*/}
            <button 
              className="text-white bg-[#2a3a50] hover:bg-[#DDA600] px-4 py-2 mt-2 rounded-md"
              onClick={() => goToNextPage("dashboard")}
            >
              Dashboard
            </button>
            <button 
              className="text-white bg-[#2a3a50] hover:bg-[#DDA600] px-4 py-2 rounded-md"
              onClick={() => goToNextPage("calendar")}
            >
              Calendar
            </button>
            <button 
              className="text-white bg-[#2a3a50] hover:bg-[#DDA600] px-4 py-2 rounded-md"
              onClick={() => goToNextPage("payment")}
            >
              Premium
            </button>
            <button 
              className="text-white bg-[#2a3a50] hover:bg-[#DDA600] px-4 py-2 rounded-md"
              onClick={() => goToNextPage("account")}
            >
              Settings
            </button>
          </div>
        </nav>
      )}

      {currentPage === "home" && <Home goToNextPage={goToNextPage} />}
      {currentPage === "login" && <Login goToNextPage={goToNextPage} />}
      {currentPage === "calendar" && <Calendar goToNextPage={goToNextPage} />}
      {currentPage === "payment" && <Payment goToNextPage={goToNextPage} />}
      {currentPage === "account" && <Account goToNextPage={goToNextPage} />}
      {currentPage === "dashboard" && <Dashboard goToNextPage={goToNextPage} />}
      {/*{currentPage === "dashboard_a" && <Dashboard_A goToNextPage={goToNextPage} />}
      {currentPage === "dashboard_w" && <Dashboard_W goToNextPage={goToNextPage} />}*/}
    </>
  );
}
