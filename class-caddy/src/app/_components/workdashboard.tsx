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
import { CalEvent, Student, Shift, Job } from "@prisma/client";
import { api } from "~/trpc/react";

export default function WorkDashboard({ user, goToNextPage }: { user: Student | null, goToNextPage: (page: string) => void }) {

  //database calls

  //event database calls
  const createEvent = api.calEvent.addEvent.useMutation();
  const deleteEvent = api.calEvent.deleteEvent.useMutation();
  const getOneEvent = api.calEvent.getSingleEvent.useMutation();
  const editEvent = api.calEvent.editEvent.useMutation();
  const getWorkEvents = api.calEvent.getWorkEvents.useMutation();

  //job database calls
  const getJob = api.job.checkUserJob.useMutation();
  const createJob = api.job.addJob.useMutation();
  const createShift = api.shift.addShift.useMutation();

  //shift database calls
  const getShifts = api.shift.getUserShifts.useMutation();
  const editShift = api.shift.updateShift.useMutation();
  const deleteShift = api.shift.deleteShift.useMutation();

  //form states
  const [showShiftEditForm, setShowShiftEditForm] = useState(false);
  const [showAddShiftForm, setShowAddShiftForm] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)


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
  const [refreshShifts, setRefreshShifts] = useState(0);

  //course states
  const [allUserShifts, setAllUserShifts] = useState<Shift[]>([]);
  const [shiftIdToEdit, setShiftIdToEdit] = useState<string | null>(null);

  //assignment states
  const [jobTitle, setJobTitle] = useState("");
  const [supervisorName, setSupervisorName] = useState("");
  const [workPhone, setWorkPhone] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [shiftStart, setShiftStart] = useState("");
  const [shiftEnd, setShiftEnd] = useState("");
  const [shiftNotes, setShiftNotes] = useState("");
  const [hasJob, setHasJob] = useState<Job>();
  const [checkingJob, setCheckingJob] = useState(true);



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
    const checkForJob = async () => {
      if (user) {
        const userJob = await getJob.mutateAsync(user.email);
        if (userJob) {
          setHasJob(userJob)
          setJobTitle(userJob.jobTitle)
          setSupervisorName(userJob.supervisor)
          setWorkPhone(userJob.jobPhone)
          setWorkEmail(userJob.jobEmail)
        }
      }
      setCheckingJob(false);
    }
    const getUserWorkEvents = async () => {
      if (user) {
        const allUserWorkEvents = await getWorkEvents.mutateAsync(user.email);
        setAllEvents(allUserWorkEvents);
      }


    };

    const getUserShifts = async () => {
      if (user) {
        const allShifts = await getShifts.mutateAsync(user.email);
        setAllUserShifts(allShifts);
      }
    }



    if (user) {


      getUserWorkEvents();
      getUserShifts();
      checkForJob();

    }
  }, [user, refreshEvents, refreshShifts]);

  function handleDateClick(arg: { date: Date, allDay: boolean }) {
    const dateString = arg.date.toISOString().slice(0, 16); // Format to `YYYY-MM-DDTHH:mm`
    setStart(dateString); // Set default start time
    setEnd(dateString);   // Optionally set a default end time (same as start)
    setShowModal(true)
  }




  async function handleShiftClick(shift: Shift) {
    if (user) {
      setShiftIdToEdit(shift.id)
      setShiftStart(formatDateForInput(shift.start));
      setShiftEnd(formatDateForInput(shift.end));
      setShowShiftEditForm(true);
    }

  }

  async function handleShiftDelete() {
    if (shiftIdToEdit) {

      await deleteShift.mutateAsync({ id: shiftIdToEdit })
      setRefreshShifts((prev) => prev + 1);
      setrefreshEvents((prev) => prev + 1);
    }

    setShiftIdToEdit("")
    setShiftStart("");
    setShiftEnd("");

  }

  async function handleEditModal(data: { event: { id: string } }) {
    setShowDeleteModal(true);
    setIdToEdit(data.event.id)
    const event = await getOneEvent.mutateAsync(data.event.id);
    if (event) {

      setTitle(event.title);
      setStart(formatDateForInput(event.start));
      setEnd(formatDateForInput(event.end));
      setEventTag(event.tag || "Work");
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
        tag: eventTag
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

      const allUserWorkEvents = await getWorkEvents.mutateAsync(user.email);
      setAllEvents(allUserWorkEvents);
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
        <h2>{user?.firstName}'s Work Dashboard</h2>
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
              <h2 className="text-xl font-semibold text-white mt-4 ml-4">Job Information</h2>
              <p className="text-base text-white ml-4"> Title: {jobTitle} </p>
              <p className="text-base text-white ml-4"> Supervisor: {supervisorName} </p>
              <p className="text-base text-white ml-4"> Work Phone: {workPhone} </p>
              <p className="text-base text-white ml-4"> Work Email: {workEmail} </p>
            </div>
            <div className='w-1/2'>

              <h2 className="text-xl font-semibold text-white mt-4 ml-4">Upcoming Shifts</h2>
              <button className="text-white bg-[#2a3a50] hover:bg-[#DDA600] px-4 py-2 rounded-md ml-4" style={{ marginBottom: '10px' }} onClick={() => { setShowAddShiftForm(true) }} >Add Shift</button>
              <p className="text-base text-white ml-4">Shift Start | Shift End</p>
              {

                allUserShifts.map((shift) => {
                  if (shift.start > new Date()) {
                    return (
                      <div key={shift.id}
                        onClick={() => { handleShiftClick(shift) }}
                        className="text-base text-white cursor-pointer hover:underline ml-4"> start: {shift.start.toLocaleString().slice(0, 16)} | end: {shift.end.toLocaleString()} </div>
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


        {!hasJob && !checkingJob && (
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
                  const newJob = await createJob.mutateAsync({
                    studentId: user.email,
                    title: jobTitle,
                    supervisor: supervisorName,
                    jobPhone: workPhone,
                    jobEmail: workEmail
                  });

                  if (newJob) {
                    setHasJob(newJob);
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
                Enter Job
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
                  alert("Must add job to use work dashboard. Redirecting to main dashboard");
                  goToNextPage('main dashboard');
                }}

              >
                X
              </button>

              <input
                type="text"
                placeholder="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
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
                placeholder="Supervisor"
                value={supervisorName}
                onChange={(e) => setSupervisorName(e.target.value)}
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
                value={workPhone}
                onChange={(e) => setWorkPhone(e.target.value)}
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
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
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

        {showAddShiftForm && (
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
                  if (hasJob) {
                    const newShift = await createShift.mutateAsync({
                      studentId: user.email,
                      start: new Date(shiftStart),
                      end: new Date(shiftEnd),
                      jobId: hasJob.id
                    })

                    setAllUserShifts([...allUserShifts, newShift])
                    setRefreshShifts((prev) => prev + 1);
                    setShowAddShiftForm(false);
                  }

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
                  setShiftStart('');
                  setShiftEnd('');
                  setShowAddShiftForm(false)
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
                Enter Shift Information
              </h3>
              <input
                type="datetime-local"
                placeholder="Due Date"
                value={shiftStart}
                onChange={(e) => { setShiftStart(e.target.value) }}
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
                placeholder="Due Date"
                value={shiftEnd}
                onChange={(e) => { setShiftEnd(e.target.value) }}
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
                value={shiftNotes}
                onChange={(e) => { setShiftNotes(e.target.value) }}
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


        {showShiftEditForm && (
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
                  if (shiftIdToEdit) {
                    const updatedShift = await editShift.mutateAsync({
                      id: shiftIdToEdit,
                      start: new Date(shiftStart),
                      end: new Date(shiftEnd)
                    })

                    if (updatedShift) {
                      setAllUserShifts((prevShifts) =>
                        prevShifts.map((shift) =>
                          shift.id === updatedShift.id
                            ? { ...shift, ...updatedShift } // Update the course if it matches
                            : shift // Keep the other courses as they are
                        )
                      );
                    }
                  }



                  setRefreshShifts((prev) => prev + 1);
                  setShiftEnd("");
                  setShiftStart("");
                  setShiftIdToEdit("");
                  setShowShiftEditForm(false);
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
                  setShiftStart('');
                  setShiftEnd('');
                  setShowShiftEditForm(false)
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
                Edit Shift Information
              </h3>
              <input
                type="datetime-local"
                placeholder="Start Time"
                value={shiftStart}
                onChange={(e) => { setShiftStart(e.target.value) }}
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
                value={shiftEnd}
                onChange={(e) => { setShiftEnd(e.target.value) }}
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
                value={shiftNotes}
                onChange={(e) => { setShiftNotes(e.target.value) }}
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
                  handleShiftDelete();
                  setShowShiftEditForm(false);
                }}>
                Delete Shift
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
