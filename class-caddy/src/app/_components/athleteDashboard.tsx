"use client"
import { useEffect } from 'react';
import React, { Fragment, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { Dialog } from '@headlessui/react'
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";
import { EventSourceInput } from "@fullcalendar/core/index.js";
import { CalEvent, Student, Sport, Practice } from "@prisma/client";
import { api } from "~/trpc/react";

export default function AthleteDashboard({ user, goToNextPage }: { user: Student | null, goToNextPage: (page: string) => void }) {

  //database calls

  //event database calls
  const createEvent = api.calEvent.addEvent.useMutation();
  const deleteEvent = api.calEvent.deleteEvent.useMutation();
  const getOneEvent = api.calEvent.getSingleEvent.useMutation();
  const editEvent = api.calEvent.editEvent.useMutation();
  const getAthleticEvents = api.calEvent.getAthleticEvents.useMutation();

  //sport database calls
  const getPractices = api.practice.getUserPractices.useMutation();
  const getSport = api.sport.checkUserSport.useMutation();
  const createSport = api.sport.addSport.useMutation();

  //practice database calls
  const createPractice = api.practice.addPractice.useMutation();
  const editPractice = api.practice.updatePractice.useMutation();
  const deletePractice = api.practice.deletePractice.useMutation();

  //form states

  //event
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  //practice
  const [showPracticeEditForm, setShowPracticeEditForm] = useState(false);
  const [showAddPracticeForm, setShowAddPracticeForm] = useState(false);

  //event states
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [eventTag, setEventTag] = useState("Academics");
  const [recurrence, setRecurrence] = useState("");
  const [recurrenceEnd, setRecurrenceEnd] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [allEvents, setAllEvents] = useState<CalEvent[]>([]);
  const [idToEdit, setIdToEdit] = useState<string | null>(null);


  //effect states
  const [refreshEvents, setrefreshEvents] = useState(0);
  const [refreshPractices, setRefreshPractices] = useState(0);

  //sport states
  const [sportTitle, setSportTitle] = useState("");
  const [teamTitle, setTeamTitle] = useState("");
  const [coachName, setCoachName] = useState("");
  const [coachPhone, setCoachPhone] = useState("");
  const [coachEmail, setCoachEmail] = useState("");
  const [hasSport, setHasSport] = useState<Sport>();
  const [checkingSport, setCheckingSport] = useState(true);

  //practice states
  const [practiceStart, setPracticeStart] = useState("");
  const [practiceNotes, setPracticeNotes] = useState("");
  const [practiceEnd, setPracticeEnd] = useState("");
  const [allUserPractices, setAllUserPractices] = useState<Practice[]>([]);
  const [practiceIdToEdit, setPracticeIdToEdit] = useState<string | null>(null);


  function formatDateForInput(date: string | Date): string {
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    const hours = String(localDate.getHours()).padStart(2, '0');
    const minutes = String(localDate.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  useEffect(() => {
    const checkForSport = async () => {
      if (user) {
        const userSport = await getSport.mutateAsync(user.email);
        if (userSport) {
          setHasSport(userSport);
          setSportTitle(userSport.sportName);
          setTeamTitle(userSport.teamName);
          setCoachName(userSport.Coach);
          setCoachPhone(userSport.coachPhone);
          setCoachEmail(userSport.coachEmail)
        }
      }
      setCheckingSport(false);
    }
    const getUserAthleticEvents = async () => {
      if (user) {
        const allUserAthleticsEvents = await getAthleticEvents.mutateAsync(user.email);
        setAllEvents(allUserAthleticsEvents);
      }


    };

    const getUserPractices = async () => {
      if (user) {
        const allPractices = await getPractices.mutateAsync(user.email);
        setAllUserPractices(allPractices);
      }
    }



    if (user) {


      getUserAthleticEvents();
      getUserPractices();
      checkForSport();

    }
  }, [user, refreshEvents, refreshPractices]);

  function handleDateClick(arg: { date: Date, allDay: boolean }) {
    const dateString = arg.date.toISOString().slice(0, 16); // Format to `YYYY-MM-DDTHH:mm`
    setStart(dateString); // Set default start time
    setEnd(dateString);   // Optionally set a default end time (same as start)
    setShowModal(true)
  }




  async function handlePracticeClick(practice: Practice) {
    if (user) {
      setPracticeIdToEdit(practice.id);
      setPracticeStart(formatDateForInput(practice.start));
      setPracticeEnd(formatDateForInput(practice.end));
      if (practice.notes) {
        setPracticeNotes(practice.notes)
      }

      setShowPracticeEditForm(true);
    }

  }

  async function handlePracticeDelete() {
    if (practiceIdToEdit) {
      const deletedEvent = await deletePractice.mutateAsync({ id: practiceIdToEdit })
      setRefreshPractices((prev) => prev + 1);
      setrefreshEvents((prev) => prev + 1);
    }

    setPracticeIdToEdit("");
    setPracticeNotes("");
    setPracticeStart("");
    setPracticeEnd("");

  }

  async function handleEditModal(data: { event: { id: string } }) {
    setShowDeleteModal(true);
    setIdToEdit(data.event.id)
    const event = await getOneEvent.mutateAsync(data.event.id);
    if (event) {

      setTitle(event.title);
      setStart(formatDateForInput(event.start));
      setEnd(formatDateForInput(event.end));
      setEventTag(event.tag || "Athletics");
    }

  }

  async function handleEdit() {
    if (idToEdit) {
      const changedEvent = await editEvent.mutateAsync({
        id: idToEdit,
        title: title,
        start: new Date(start),
        end: new Date(end),
        allDay: allDay,
        tag: eventTag,
      })
    }


    setrefreshEvents((prev) => prev + 1);
    setShowDeleteModal(false)
    setIdToEdit(null)
  }

  async function handleDelete() {
    if (idToEdit) {
      const deletedEvent = await deleteEvent.mutateAsync(idToEdit)
      setrefreshEvents((prev) => prev + 1);
    }
    setShowDeleteModal(false)
    setIdToEdit(null)
    setTitle("");
    setStart("");
    setEnd("");
    setEventTag("");
    setShowModal(false)
    setShowDeleteModal(false);
    setIdToEdit(null);
  }
  function handleCloseModal() {
    setTitle("");
    setStart("");
    setEnd("");
    setEventTag("");
    setShowModal(false)
    setShowDeleteModal(false);
    setIdToEdit(null);
  }




  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setShowModal(false)
    if (user) {
      const newEvent = await createEvent.mutateAsync({

        studentId: user.email,
        title: title,
        start: new Date(start),
        end: new Date(end),
        allDay: allDay,
        tag: eventTag,
        recurrence: recurrence,
        recurrenceEnd: recurrenceEnd ? new Date(recurrenceEnd) : undefined

      })

      const allUserAthleticEvents = await getAthleticEvents.mutateAsync(user.email);
      setAllEvents(allUserAthleticEvents);
    }
    setTitle("");
    setStart("");
    setEnd("");
    setEventTag("");

  }



  return (
    <div>

      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#7197C1] to-[#446486] text-white">
        <br></br>
        <h2>{user?.firstName}'s Athletic's Dashboard</h2>
        <br></br>
        <nav className="flex justify-end items-center mb-12 w-full max-w-screen-xl mx-auto px-4">
          <div className="flex space-x-4">
            <button className="text-white bg-[#2a3a50] hover:bg-[#DDA600] px-4 py-2 rounded-md" onClick={() => { goToNextPage('settings') }}>Settings</button>
            <button className="text-white bg-[#2a3a50] hover:bg-[#DDA600] px-4 py-2 rounded-md" onClick={() => { goToNextPage('main dashboard') }}>Dashboard</button>
          </div>
        </nav>
        <div className="grid grid-cols-10">
          <div className="col-span-8">
            <FullCalendar
              plugins={[
                dayGridPlugin,
                interactionPlugin,
                timeGridPlugin]}
              headerToolbar={{
                left: 'prev, next, today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              buttonText={{
                today: 'Today',
                day: 'Day',
                week: 'Week',
                month: 'Month',
              }}

              events={allEvents as EventSourceInput}
              nowIndicator={true}
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              dateClick={handleDateClick}
              eventClick={(data) => handleEditModal(data)}

            />

          </div>
        </div>
        <div className="w-full bg-[#446486] flex-1 h-35 rounded-t-3xl">
          <div className="flex space-x-4">
            <div className='w-1/2'>
              <h2 className="text-xl font-semibold text-white mt-4 ml-4">Sport Information</h2>
              <p className="text-base text-white ml-4"> Sport: {sportTitle} </p>
              <p className="text-base text-white ml-4"> Team: {teamTitle} </p>
              <p className="text-base text-white ml-4"> Coach: {coachName} </p>
              <p className="text-base text-white ml-4"> Coach Phone: {coachPhone} </p>
              <p className="text-base text-white ml-4"> Coach Email: {coachEmail} </p>
            </div>
            <div className='w-1/2'>

              <h2 className="text-xl font-semibold text-white mt-4 ml-4">Upcoming Practices</h2>
              <button className="text-white bg-[#2a3a50] hover:bg-[#DDA600] px-4 py-2 rounded-md ml-4" style={{ marginBottom: '10px' }} onClick={() => { setShowAddPracticeForm(true) }} >Add Practice</button>
              <p className="text-base text-white ml-4">Practice Start | Practice End</p>
              {

                allUserPractices.map((practice) => {
                  if (practice.start > new Date()) {
                    return (
                      <div key={practice.id}
                        onClick={() => { handlePracticeClick(practice) }}
                        className="text-base text-white cursor-pointer hover:underline ml-4"> start: {practice.start.toLocaleString().slice(0, 16)} | end: {practice.end.toLocaleString()} </div>
                    )
                  }

                })
              }

            </div>
          </div>
        </div>
        <Transition show={showDeleteModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setShowDeleteModal}>
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo='opacity-100'
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <TransitionChild
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                  <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="sm:flex sm:items-start">
                      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <DialogTitle as="h3" className="test-base font-semibold leading-6 text-grey-900">
                            Edit Event
                          </DialogTitle>
                          <form>
                            <div className="mt-2">
                              <input type="text" name="title" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6" value={title} onChange={(e) => { setTitle(e.target.value) }} />
                            </div>
                            <div className="mt-2">
                              <label htmlFor="tag">Tag</label>
                              <select
                                id="tag"
                                value={eventTag}
                                onChange={(e) => setEventTag(e.target.value)}
                                className="block w-full rounded-md"
                              >
                                <option value="Academics">Academics</option>
                                <option value="Work">Work</option>
                                <option value="Personal">Personal</option>
                              </select>
                            </div>
                            <div className="mt-2">
                              <input type="datetime-local" name="start time" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6 pl-3" value={start} onChange={(e) => { setStart(e.target.value) }} placeholder="Start Date" />
                            </div>
                            <div className="mt-2">
                              <input type="datetime-local" name="end time" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6 pl-3" value={end} onChange={(e) => { setEnd(e.target.value) }} placeholder="End Date" />
                            </div>
                            <div className="mt-2">
                              <label>
                                <input
                                  type="checkbox"
                                  checked={allDay}
                                  onChange={(e) => setAllDay(e.target.checked)}
                                />
                                All Day
                              </label>
                            </div>
                            <br></br>

                            <div className="mt-0">
                              <label htmlFor="recurrence">Recurrence Pattern</label>
                              <select
                                id="recurrence"
                                value={recurrence}
                                onChange={(e) => setRecurrence(e.target.value)}
                                className="block w-full rounded-md"
                                style={{
                                  border: '1px solid #ccc',
                                  padding: '8px',
                                  borderRadius: '4px'
                                }}
                              >
                                <option value="">None</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                              </select>
                            </div>
                            <br></br>
                            <div className="mt-0">
                              <label htmlFor="recurrence-end">Recurrence Ends</label>
                              <input
                                type="date"
                                style={{
                                  border: '1px solid #ccc',
                                  padding: '8px',
                                  borderRadius: '4px'
                                }}
                                id="recurrence-end"
                                value={recurrenceEnd}
                                onChange={(e) => setRecurrenceEnd(e.target.value)}
                                className="block w-full rounded-md"
                              />
                            </div>
                            <br></br>
                          </form>
                          <div className="mt-2">
                            <p className="test-sm text-gray-500">
                              Delete this event?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text:sm 
                                font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" onClick={handleDelete}>
                        Delete Event
                      </button>

                      <button type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text:sm 
                              font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" onClick={handleEdit}>
                        Edit Event
                      </button>

                      <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text:sm
                                font-semibold shadow-sm ring-1 ring-insert ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={handleCloseModal}>
                        Cancel
                      </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
        <Transition show={showModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
            <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center p-4 text-center sm:items-center">
                <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 sm:w-[300px] sm:h-[595px]">
                    <div>
                      {/* <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white">
                          <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true"/>
                        </div> */}
                      <div className="mt-3 text-center sm:mt-5">
                        <DialogTitle as="h3" className="text-base front-semibold leading-6 text-gray-90">
                          Add Event
                        </DialogTitle>
                        <form action="submit" onSubmit={handleSubmit}>
                          <div className="mt-2 mb-4">
                            <input type="text" name="title" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6 pl-3" value={title} onChange={(e) => { setTitle(e.target.value) }} placeholder="Title" />
                          </div>
                          <div className="mt-2">
                            <label htmlFor="tag">Tag</label>
                            <select
                              id="tag"
                              value={eventTag}
                              onChange={(e) => setEventTag(e.target.value)}
                              className="block w-full rounded-md"
                            >
                              <option value="Academics">Academics</option>
                              <option value="Work">Work</option>
                              <option value="Personal">Personal</option>
                            </select>
                          </div>
                          <div className="mt-2">
                            <input type="datetime-local" name="start time" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6 pl-3" value={start} onChange={(e) => { setStart(e.target.value) }} placeholder="Start Date" />
                          </div>
                          <div className="mt-2">
                            <input type="datetime-local" name="end time" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6 pl-3" value={end} onChange={(e) => { setEnd(e.target.value) }} placeholder="End Date" />
                          </div>
                          <div className="mt-2">
                            <label>
                              <input
                                type="checkbox"
                                checked={allDay}
                                onChange={(e) => setAllDay(e.target.checked)}
                              />
                              All Day
                            </label>
                          </div>
                          <br></br>

                          <div className="mt-0">
                            <label htmlFor="recurrence">Recurrence Pattern</label>
                            <select
                              id="recurrence"
                              value={recurrence}
                              onChange={(e) => setRecurrence(e.target.value)}
                              className="block w-full rounded-md"
                              style={{
                                border: '1px solid #ccc',
                                padding: '8px',
                                borderRadius: '4px'
                              }}
                            >
                              <option value="">None</option>
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                          </div>
                          <br></br>
                          <div className="mt-0">
                            <label htmlFor="recurrence-end">Recurrence Ends</label>
                            <input
                              type="date"
                              style={{
                                border: '1px solid #ccc',
                                padding: '8px',
                                borderRadius: '4px'
                              }}
                              id="recurrence-end"
                              value={recurrenceEnd}
                              onChange={(e) => setRecurrenceEnd(e.target.value)}
                              className="block w-full rounded-md"
                            />
                          </div>
                          <br></br>


                          <div className="mt-5 sm:mt-0 sm:grid-flow-row-dense sm:grid-cols-2">
                            <button type="submit" className="inlne-flex w-full justify-center rounded-md bg-[#6EAAEA] px-3 py-2 text:sm font-semibold text-white shadow-sm hover:bg-[#4163DF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4163DF] sm:col-start-2 disabled:opacity-25">
                              Create
                            </button>
                            <button type="submit" className="mt-3 inlne-flex w-full justify-center rounded-md bg-[#A33E3E] px-3 py-2 text:sm font-semibold text-white shadow-sm hover:bg-[#EC1010] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EC1010] sm:col-start-2 disabled:opacity-25 onClick={handleCloseModal}">
                              Cancel
                            </button>
                            <br></br>
                          </div>
                        </form>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>


        {!hasSport && !checkingSport && (
          <div
            style={{
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
              style={{
                backgroundColor: '#7197C1',
                padding: '20px',
                borderRadius: '8px',
                border: '2px solid #7197C1',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                width: '80%',
                position: 'relative',
                alignContent: 'center'
              }}
              onSubmit={async (e: React.FormEvent) => {
                e.preventDefault();
                if (user) {
                  const newSport = await createSport.mutateAsync({
                    studentId: user.email,
                    teamName: teamTitle,
                    sportName: sportTitle,
                    coach: coachName,
                    coachPhone: coachPhone,
                    coachEmail: coachEmail

                  });

                  if (newSport) {
                    setHasSport(newSport);
                  }
                }


              }}

            >
              <h3
                style={{
                  color: 'white',                // Makes the text color white
                  fontWeight: 'bold',            // Makes the text bold (strong)
                  textAlign: 'center',           // Centers the heading
                  marginBottom: '20px',          // Adds space below the heading
                }}
              >
                Enter Sport
              </h3>

              <button
                style={{
                  position: 'absolute',  // Position the close button in the top-left corner
                  top: '10px',
                  left: '10px',
                  backgroundColor: 'transparent',  // Make the background transparent
                  color: 'red',  // Red color for the "X"
                  fontSize: '24px', // Size of the "X"
                  border: 'none', // Remove the border
                  cursor: 'pointer',
                }}
                onClick={() => {
                  alert("Must add sport to use athletic dashboard. Redirecting to main dashboard");
                  goToNextPage('main dashboard');
                }}

              >
                X
              </button>
              <input
                type="text"
                placeholder="Sport Title"
                value={sportTitle}
                onChange={(e) => setSportTitle(e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '36.526px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  padding: '5px',
                  marginBottom: '10px',
                  color: 'black',
                  backgroundColor: 'white',
                }}
              />

              <input
                type="text"
                placeholder="Team Title"
                value={teamTitle}
                onChange={(e) => setTeamTitle(e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '36.526px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  padding: '5px',
                  marginBottom: '10px',
                  color: 'black',
                  backgroundColor: 'white',
                }}
              />


              <input
                type="text"
                placeholder="Coach"
                value={coachName}
                onChange={(e) => setCoachName(e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '36.526px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  padding: '5px',
                  marginBottom: '10px',
                  color: 'black',
                  backgroundColor: 'white',
                }}
              />

              <input
                type="text"
                placeholder="phone"
                value={coachPhone}
                onChange={(e) => setCoachPhone(e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '36.526px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  padding: '5px',
                  marginBottom: '10px',
                  color: 'black',
                  backgroundColor: 'white',
                }}
              />

              <input
                type="text"
                placeholder="email"
                value={coachEmail}
                onChange={(e) => setCoachEmail(e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '36.526px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  padding: '5px',
                  marginBottom: '10px',
                  color: 'black',
                  backgroundColor: 'white',
                }}
              />





              <button
                type='submit'
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
                  transition: 'background-color 0.3s',
                }}
              >
                Submit
              </button>
            </form>
          </div>
        )
        }

        {showAddPracticeForm && (
          <div
            style={{
              position: 'fixed',  // Make it overlay the screen
              top: '0',           // Align it to the top of the screen
              left: '0',          // Align it to the left of the screen
              width: '100%',      // Make it full width
              height: '100%',     // Make it full height
              backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent overlay background
              display: 'flex',    // Use flexbox to center the form
              justifyContent: 'center', // Horizontally center the form
              alignItems: 'center', // Vertically center the form
              zIndex: '1000',// Make sure it appears above other content
            }}
          >
            <form
              style={{
                backgroundColor: '#7197C1',
                padding: '20px',
                borderRadius: '8px',
                border: '2px solid #7197C1',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                width: '80%',
                position: 'relative',
                alignContent: 'center'
              }}
              onSubmit={async (e: React.FormEvent) => {
                e.preventDefault();
                if (user) {
                  if (hasSport) {

                    const newPractice = await createPractice.mutateAsync({
                      studentId: user.email,
                      start: new Date(practiceStart),
                      end: new Date(practiceEnd),
                      sportId: hasSport.id,
                      notes: practiceNotes
                    })

                    setPracticeStart("");
                    setPracticeEnd("");
                    setPracticeNotes("");

                    setAllUserPractices([...allUserPractices, newPractice])
                    setRefreshPractices((prev) => prev + 1);
                    setShowAddPracticeForm(false);

                  }

                  setPracticeStart("");
                  setPracticeEnd("");
                  setPracticeNotes("");
                }

              }}
            >

              <button
                style={{
                  position: 'absolute',  // Position the close button in the top-left corner
                  top: '10px',
                  left: '10px',
                  backgroundColor: 'transparent',  // Make the background transparent
                  color: 'red',  // Red color for the "X"
                  fontSize: '24px', // Size of the "X"
                  border: 'none', // Remove the border
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setPracticeStart('');
                  setPracticeEnd('');
                  setPracticeNotes('');
                  setShowAddPracticeForm(false)
                }}>
                X
              </button>

              <h3
                style={{
                  color: 'white',                // Makes the text color white
                  fontWeight: 'bold',            // Makes the text bold (strong)
                  textAlign: 'center',           // Centers the heading
                  marginBottom: '20px',          // Adds space below the heading
                }}
              >
                Enter Practice: Information
              </h3>
              <input
                type="datetime-local"
                placeholder="Practice Start"
                value={practiceStart}
                onChange={(e) => { setPracticeStart(e.target.value) }}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '36.526px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  padding: '5px',
                  marginBottom: '10px',
                  color: 'black',
                  backgroundColor: 'white',
                }}
              />

              <input
                type="datetime-local"
                placeholder="End Date"
                value={practiceEnd}
                onChange={(e) => { setPracticeEnd(e.target.value) }}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '36.526px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  padding: '5px',
                  marginBottom: '10px',
                  color: 'black',
                  backgroundColor: 'white',
                }}
              />

              <textarea
                id="description"
                value={practiceNotes}
                onChange={(e) => { setPracticeNotes(e.target.value) }}
                style={{
                  width: '100%',
                  height: '150px', // Adjust height as needed
                  padding: '10px',
                  fontSize: '16px',
                  color: 'black'
                }}

                placeholder="Enter a paragraph description here..."
              />




              <button
                type='submit'
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
                  transition: 'background-color 0.3s',
                }}
              >
                Submit
              </button>


            </form>
          </div>
        )}


        {showPracticeEditForm && (
          <div
            style={{
              position: 'fixed',  // Make it overlay the screen
              top: '0',           // Align it to the top of the screen
              left: '0',          // Align it to the left of the screen
              width: '100%',      // Make it full width
              height: '100%',     // Make it full height
              backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent overlay background
              display: 'flex',    // Use flexbox to center the form
              justifyContent: 'center', // Horizontally center the form
              alignItems: 'center', // Vertically center the form
              zIndex: '1000',// Make sure it appears above other content
            }}
          >
            <form
              style={{
                backgroundColor: '#7197C1',
                padding: '20px',
                borderRadius: '8px',
                border: '2px solid #7197C1',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                width: '80%',
                position: 'relative',
                alignContent: 'center'
              }}
              onSubmit={async (e: React.FormEvent) => {
                e.preventDefault();
                if (user) {
                  if (practiceIdToEdit) {
                    const updatedPractice = await editPractice.mutateAsync({
                      id: practiceIdToEdit,
                      start: new Date(practiceStart),
                      end: new Date(practiceStart),
                      notes: practiceNotes
                    })

                    if (updatedPractice) {
                      setAllUserPractices((prevPractices) =>
                        prevPractices.map((practice) =>
                          practice.id === updatedPractice.id
                            ? { ...practice, ...updatedPractice } // Update the course if it matches
                            : practice // Keep the other courses as they are
                        )
                      );
                    }
                  }



                  setRefreshPractices((prev) => prev + 1);
                  setPracticeEnd("");
                  setPracticeStart("");
                  setPracticeIdToEdit("");
                  setShowPracticeEditForm(false);
                }

              }



              }
            >

              <button
                style={{
                  position: 'absolute',  // Position the close button in the top-left corner
                  top: '10px',
                  left: '10px',
                  backgroundColor: 'transparent',  // Make the background transparent
                  color: 'red',  // Red color for the "X"
                  fontSize: '24px', // Size of the "X"
                  border: 'none', // Remove the border
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setPracticeStart('');
                  setPracticeEnd('');
                  setShowPracticeEditForm(false)
                }}>
                X
              </button>

              <h3
                style={{
                  color: 'white',                // Makes the text color white
                  fontWeight: 'bold',            // Makes the text bold (strong)
                  textAlign: 'center',           // Centers the heading
                  marginBottom: '20px',          // Adds space below the heading
                }}
              >
                Edit Practice Information
              </h3>
              <input
                type="datetime-local"
                placeholder="Start Time"
                value={practiceStart}
                onChange={(e) => { setPracticeStart(e.target.value) }}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '36.526px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  padding: '5px',
                  marginBottom: '10px',
                  color: 'black',
                  backgroundColor: 'white',
                }}
              />

              <input
                type="datetime-local"
                placeholder="End Time"
                value={practiceEnd}
                onChange={(e) => { setPracticeEnd(e.target.value) }}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '36.526px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  padding: '5px',
                  marginBottom: '10px',
                  color: 'black',
                  backgroundColor: 'white',
                }}
              />

              <label>Notes: </label>

              <textarea
                id="description"
                value={practiceNotes}
                onChange={(e) => { setPracticeNotes(e.target.value) }}
                style={{
                  width: '100%',
                  height: '150px', // Adjust height as needed
                  padding: '10px',
                  fontSize: '16px',
                  color: 'black'
                }}

                placeholder="Enter a paragraph description here..."
              />



              <button type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text:sm 
                        font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" onClick={() => {
                  handlePracticeDelete();
                  setShowPracticeEditForm(false);
                }}>
                Delete Practice
              </button>


              <button
                type='submit'
                style={{
                  padding: '10px 20px',
                  cursor: 'pointer',
                  marginTop: '20px',
                  marginLeft: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#6EAAEA',
                  color: '#FFF',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s',
                }}
              >
                Submit
              </button>


            </form>
          </div>
        )}



      </main>

    </div>
  );
}
