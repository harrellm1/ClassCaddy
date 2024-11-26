import { useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Logo from "~/app/_components/logo";
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/16/solid";

// Define Event type
interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: number;
}

export default function Calendar({ goToNextPage }: { goToNextPage: (page: string) => void }) {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState<Event>({
    title: '',
    start: '',
    allDay: false,
    id: 0
  });
  const [currentPage, setCurrentPage] = useState("calendar"); // Use state to switch between views
  function toggleView(view: string) {
    setCurrentPage(view);
  }
  

  // Handle clicking on the calendar date
  function handleDateClick(arg: { date: Date, allDay: boolean }) {
    setNewEvent({ ...newEvent, start: arg.date, allDay: arg.allDay, id: new Date().getTime() });
    setShowModal(true);
  }

  // Add new event
  function addEvent(data: { date: Date, allDay: boolean, draggedEl: HTMLElement }) {
    const event = { ...newEvent, start: data.date.toISOString(), title: data.draggedEl.innerText, allDay: data.allDay, id: new Date().getTime() };
    setAllEvents([...allEvents, event]);
  }

  // Handle delete event modal
  function handleDeleteModal(data: { event: { id: string } }) {
    setShowDeleteModal(true);
    setIdToDelete(Number(data.event.id));
  }

  // Delete selected event
  function handleDelete() {
    setAllEvents(allEvents.filter(event => Number(event.id) !== Number(idToDelete)));
    setShowDeleteModal(false);
    setIdToDelete(null);
  }

  // Close modals
  function handleCloseModal() {
    setShowModal(false);
    setNewEvent({ title: "", start: "", allDay: false, id: 0 });
    setShowDeleteModal(false);
    setIdToDelete(null);
  }


  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#446486' }}>
      
      {/* Button to toggle between Calendar and Premium views */}
      <div 
        style={{
          position: 'absolute',
          top: '34px',
          right: '0px',
          width: '130px',
          height: '100px',
          fontSize: '46px',
          cursor: 'pointer',
        }}
        onClick={() => toggleView(currentPage === "calendar" ? "premium" : "calendar")} // Toggle between views
      >
        ⭐
      </div>

      {/* Gear Icon for Settings */}
      <div 
        style={{
          position: 'absolute',
          top: '34px',
          left: '60px',
          width: '130px',
          height: '100px',
          fontSize: '46px',
          cursor: 'pointer',
        }}
        onClick={() => toggleView("settings")} // Switch to settings when clicked
      >
        ⚙️ {/* Gear Icon */}
      </div>

      {/* Calendar View */}
      {currentPage === "calendar" && (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          headerToolbar={{
            left: 'prev, next, today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={allEvents}
          nowIndicator={true}
          editable={true}
          droppable={true}
          selectable={true}
          selectMirror={true}
          dateClick={handleDateClick}
          drop={addEvent}
          eventClick={handleDeleteModal}
          

        />
      )}

    {/* Premium Content View */}
    {currentPage === "premium" && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#446486",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          padding: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            marginBottom: "20px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          Get More Done
          <Logo style={{ width: "40px", margin: "10px 0", verticalAlign: "middle" }} />
          <span style={{ fontSize: "60px", color: "#FFD700", fontWeight: "bold" }}>Premium</span>
        </h2>

        {/* Bulleted list with special features */}
        <ul
          style={{
            fontSize: "18px",
            color: "#eee",
            maxWidth: "600px",
            textAlign: "left",
            marginBottom: "40px",
            listStyleType: "disc",
          }}
        >
          <li>Special Calendars for Athletes</li>
          <li>Form Good Habits with Habit Tracker</li>
          <li>Set Goals & Reminders</li>
        </ul>

        <div
          style={{
            display: "flex",
            flexDirection: "row", // Display boxes horizontally
            justifyContent: "center",
            alignItems: "center",
            gap: "20px", // Space between boxes
            width: "100%",
          }}
        >
          {/* Monthly Plan Box */}
          <div
            onClick={() => goToNextPage("payment")} // Navigate to payment page
            style={{
              width: "343.589px",
              height: "126.717px",
              flexShrink: 0,
              borderRadius: "9px",
              background: "#7197C1",
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              padding: "20px",
              cursor: "pointer",
            }}
          >
            <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>Monthly Subscription</h3>
            <p style={{ fontSize: "14px", color: "#fff" }}>
              Flexible! Try ClassCaddy Premium for just $3.99 a month. Cancel anytime!
            </p>
          </div>

          {/* Yearly Plan Box */}
          <div
            onClick={() => goToNextPage("payment")} // Navigate to payment page
            style={{
              width: "343.589px",
              height: "126.717px",
              flexShrink: 0,
              borderRadius: "9px",
              background: "#7197C1",
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              padding: "20px",
              cursor: "pointer",
            }}
          >
            <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>Yearly Subscription</h3>
            <p style={{ fontSize: "14px", color: "#fff" }}>
              Save 30%! Get full access for $12.99 a year.
            </p>
          </div>

          {/* Lifetime Plan Box */}
          <div
            onClick={() => goToNextPage("payment")} // Navigate to payment page
            style={{
              width: "343.589px",
              height: "126.717px",
              flexShrink: 0,
              borderRadius: "9px",
              background: "#7197C1",
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              padding: "20px",
              cursor: "pointer",
            }}
          >
            <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>Lifetime Subscription</h3>
            <p style={{ fontSize: "14px", color: "#fff" }}>
              One-time payment of $49.99 for lifetime access to all features
            </p>
          </div>
        </div>

        <button
          onClick={() => toggleView("calendar")} // Go back to the calendar view
          style={{
            padding: "12px 18px",
            backgroundColor: "#446486",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "20px",
            fontSize: "16px",
          }}
        >
          Close
        </button>
      </div>
    )}


{currentPage === "settings" && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#446486',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      padding: '20px',
    }}
  >
    <h2
      style={{
        fontSize: '30px',
        fontWeight: 'bold',
        marginBottom: '20px',
      }}
    >
      Settings
    </h2>

    {/* Container for four boxes */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 343.589px)', // Two columns in the grid
        gridTemplateRows: 'repeat(2, 170.273px)', // Two rows in the grid
        gap: '60px', // Space between boxes
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Box 1 */}
      <div
        style={{
          width: '343.589px',
          height: '170.273px',
          flexShrink: 0,
          borderRadius: '9px',
          background: '#7197C1',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column', // Stack sections vertically
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        {/* Section 1: Notifications and Alerts */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '1px solid #fff',
            width: '100%',
            padding: '10px 0',
          }}
        >
          <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>Notifications and Alerts</h4>
        </div>

        {/* Section 2: First Day of the Week */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '1px solid #fff',
            width: '100%',
            padding: '10px 0',
          }}
        >
          <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>First Day of the Week</h4>
        </div>

        {/* Section 3: Account Settings*/}
        <div
          onClick={() => goToNextPage("account")}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            cursor: 'pointer',
            padding: '10px 0',
          }}
        >
          <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>Account Settings</h4>
        </div>
      </div>


      {/* Box 2 */}
      <div
        style={{
          width: '343.589px',
          height: '170.273px',
          flexShrink: 0,
          borderRadius: '9px',
          background: '#7197C1',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column', // Stack sections vertically
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        {/* Section 1: Special Calendars */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '1px solid #fff',
            width: '100%',
            padding: '10px 0',
          }}
        >
          <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>Special Calendars</h4>
        </div>

        {/* Section 2: Habit Tracker */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '1px solid #fff',
            width: '100%',
            padding: '10px 0',
          }}
        >
          <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>Habit Tracker</h4>
        </div>

        {/* Section 3: Goals */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            padding: '10px 0',
          }}
        >
          <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>Goals</h4>
        </div>
      </div>


      {/* Box 3 */}
      <div
        style={{
          width: '343.589px',
          height: '170.273px',
          flexShrink: 0,
          borderRadius: '9px',
          background: '#7197C1',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column', // Stack sections vertically
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0px',
        }}
      >
        {/* Section 1: Joelie Campana */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '1px solid #fff',
            width: '100%',
            padding: '7px 0',
          }}
        >
          <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>Joelie Campana | j.campana@ufl.edu</h4>
        </div>

        {/* Section 2: Alicia Grant */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '1px solid #fff',
            width: '100%',
            padding: '7px 0',
          }}
        >
          <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>Alicia Grant | alicia.grant@ufl.edu</h4>
        </div>

        {/* Section 3: Kaitlyn Kilner */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '1px solid #fff',
            width: '100%',
            padding: '7px 0',
          }}
        >
          <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>Kaitlyn Kilner | kaitlynkilner@ufl.edu</h4>
        </div>

        {/* Section 4: Monica Harrell */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            padding: '7px 0',
          }}
        >
          <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>Monica Harrell | harrellm1@ufl.edu</h4>
        </div>
      </div>


      {/* Box 4 */}
      {/* Box: "Get Premium" with Logo and View Toggle */}
      <div
        style={{
          width: '343.589px',
          height: '170.273px',
          flexShrink: 0,
          borderRadius: '9px',
          background: '#7197C1',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '20px',
          cursor: 'pointer',  // Makes it clickable
        }}
        onClick={() => toggleView("premium")}  // Toggle to Premium view
      >
        <h4 style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: '1.2' }}>
        <span style={{ fontSize: '50px', fontWeight: 'bold', lineHeight: '1.2' }}>classcaddy</span><br />
        <span style={{ fontSize: '25px', fontWeight: 'bold', lineHeight: '1.2' }}>Premium</span>
      </h4>
      </div>
    </div>

    <button
      onClick={() => toggleView("calendar")} // Close settings and return to calendar view
      style={{
        padding: '12px 18px',
        backgroundColor: '#446486',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '20px',
      }}
    >
      Close
    </button>
  </div>
)}

      {/* Event Creation Modal */}
      {showModal && (
        <Dialog open={showModal} onClose={handleCloseModal}>
          <Dialog.Panel style={{
            width: '300px',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          }}>
            <DialogTitle style={{ fontSize: '20px', fontWeight: 'bold' }}>Create Event</DialogTitle>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="Event Title"
              style={{
                width: '100%',
                marginBottom: '10px',
                padding: '5px',
                backgroundColor: '#f1f1f1',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <button
              onClick={() => addEvent({ date: new Date(newEvent.start), allDay: newEvent.allDay, draggedEl: { innerText: newEvent.title } })}
              style={{
                padding: '10px 15px', 
                backgroundColor: '#4CAF50', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer', 
                marginTop: '10px',
              }}
            >
              Save Event
            </button>
            <button
              onClick={handleCloseModal}
              style={{
                padding: '10px 15px', 
                backgroundColor: '#f44336', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer', 
                marginTop: '10px',
              }}
            >
              Close
            </button>
          </Dialog.Panel>
        </Dialog>
      )}

      {/* Delete Event Modal */}
      {showDeleteModal && (
        <Dialog open={showDeleteModal} onClose={handleCloseModal}>
          <Dialog.Panel style={{
            width: '300px',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          }}>
            <DialogTitle style={{ fontSize: '20px', fontWeight: 'bold' }}>Delete Event</DialogTitle>
            <p style={{ marginBottom: '20px' }}>Are you sure you want to delete this event?</p>
            <button
              onClick={handleDelete}
              style={{
                padding: '10px 15px', 
                backgroundColor: '#f44336', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
              }}
            >
              Yes, Delete
            </button>
            <button
              onClick={handleCloseModal}
              style={{
                padding: '10px 15px', 
                backgroundColor: '#4CAF50', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              Cancel
            </button>
          </Dialog.Panel>
        </Dialog>
      )}
    </div>
  );
}
