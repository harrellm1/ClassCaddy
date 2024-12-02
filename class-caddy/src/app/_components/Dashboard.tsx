"use client"
import { useEffect} from 'react';
import React, { Fragment, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, {Draggable, DropArg} from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import {DialogPanel, DialogTitle, Transition, TransitionChild} from '@headlessui/react'
import {Dialog} from '@headlessui/react'
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/16/solid";

import { EventSourceInput } from "@fullcalendar/core/index.js";
import { CalEvent, Student } from "@prisma/client";
import { api } from "~/trpc/react";
export default function Calendar({user}:{user:Student | null}) {

  const createEvent = api.calEvent.addEvent.useMutation();
  const getAllEvents = api.calEvent.getEvents.useMutation();
  const deleteEvent = api.calEvent.deleteEvent.useMutation();
  const getOneEvent = api.calEvent.getSingleEvent.useMutation();
  
  const[allEvents, setAllEvents] = useState<CalEvent[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [idToEdit, setIdToEdit] = useState<string | null>(null)
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [eventTag, setEventTag] = useState("Academics");
  const [recurrence, setRecurrence] = useState("");
  const [recurrenceEnd, setRecurrenceEnd] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [refreshEvents, setrefreshEvents] = useState(0);

  useEffect(() => {
      const getEvents = async () => {
        if(user){
          const allUserEvents = await getAllEvents.mutateAsync(user.email);
          setAllEvents(allUserEvents);
        }
        

      };
      if(user) getEvents();
  }, [user, refreshEvents]);

  function handleDateClick(arg: {date: Date, allDay: boolean}){
    const dateString = arg.date.toISOString().slice(0, 16); // Format to `YYYY-MM-DDTHH:mm`
    setStart(dateString); // Set default start time
    setEnd(dateString);   // Optionally set a default end time (same as start)
    setShowModal(true)}


  async function handleEditModal(data: {event: {id:string}}){
    setShowDeleteModal(true);
    setIdToEdit(data.event.id)

    if(idToEdit) {
      const event = await getOneEvent.mutateAsync(idToEdit);
      if(event){
        setTitle(event.title);
        setStart((event.start).toISOString());
        setEnd((event.end).toISOString());
        setEventTag(event.tag)
      }
    }
   
  }

  async function handleEdit(){
    if(idToEdit){
      
    }
    
    setrefreshEvents((prev)=> prev+1);
    setShowDeleteModal(false)
    setIdToEdit(null)
  }
  function handleCloseModal(){
    setTitle("");
    setStart("");
    setEnd("");
    setEventTag("");
    setShowModal(false)
    setShowDeleteModal(false);
    setIdToEdit(null);
  }

 

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    
    setShowModal(false)
    if(user) {
      const newEvent = await createEvent.mutateAsync({
      
        studentId: user.email,
        title:  title,
        start: new Date(start),
        end: new Date(end),
        allDay: allDay,
        tag: eventTag,
        recurrence: recurrence,
        recurrenceEnd: new Date(recurrenceEnd)
      
    })

      const allUserEvents = await getAllEvents.mutateAsync(user.email);
      setAllEvents(allUserEvents);
    }
    setTitle("");
    setStart("");
    setEnd("");
    setEventTag("");
   
  }

   return (
    <div>
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#7197C1] text-white">
    <div className="w-full h-4 bg-[#7197C1]"></div> {/* This creates the short white space */}

      <div className="flex items-center justify-center space-x-4">
        <div className="w-20 h-20 bg-[#446486] rounded-full flex items-center justify-center">
        </div>
        <div>
          <p className="text-lg font-bold">Bethany Wilson</p>
          <p className="text-sm">Full-Time Student</p>
        </div>
        </div>

      <div className="w-full h-8 bg-[#7197C1]"></div> {/* This creates the short white space */}

  
      <div className="grid grid-cols-10 w-full px-4">
          <div className="col-span-10">
          <FullCalendar
            height="250px" 
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev, next, today',
              center: 'title',
              right: 'timeGridWeek',
            }}
            buttonText={{
              today: 'Today',
              week: 'Week',
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

        <div className="w-full h-8 bg-[#7197C1]"></div>


        <div className="w-full bg-[#446486] flex-1 h-35 rounded-t-3xl">
          <div className="space-y-8 space-x-4">
            <div>
              <h2 className="text-xl font-semibold text-white mt-4 ml-4">Upcoming Deadlines</h2>
              <p className="text-base text-white ml-4">Assignments, quizzes, and exams with approaching deadlines will appear here.</p>
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
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
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
                                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true"/>
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                  <DialogTitle as="h3" className="test-base font-semibold leading-6 text-grey-900">
                                    Delete Event
                                  </DialogTitle>
                                  <form>
                                  <div className="mt-2">
                                    <input type="text" name="title" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6" value={title} onChange={(e) => {setTitle(e.target.value)}}/>
                                  </div>
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
                              font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" onClick={handleEdit}>
                                Delete
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
          <Transition show={showModal} as ={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
              <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
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
                              <input type="text" name="title" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6 pl-3" value={title} onChange={(e) => {setTitle(e.target.value)}} placeholder="Title"/>
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
                              <input type="datetime-local" name="start time" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6 pl-3" value = {start} onChange={(e)=> {setStart(e.target.value)}} placeholder="Start Date"/>
                            </div>
                            <div className="mt-2">
                              <input type="datetime-local" name="end time" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6 pl-3" value = {end} onChange={(e)=> {setEnd(e.target.value)}} placeholder="End Date"/>
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
       </main>
    </div>
  );
}
