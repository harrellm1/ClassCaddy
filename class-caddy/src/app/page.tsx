"use client"
import Link from "next/link";
import React, { Fragment, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, {Draggable, DropArg} from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import {DialogPanel, DialogTitle, Transition, TransitionChild} from '@headlessui/react'
import {Dialog} from '@headlessui/react'

import { LatestPost } from "~/app/_components/post";
//import { getServerAuthSession } from "~/server/auth";
//import { api, HydrateClient } from "~/trpc/server";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";

interface Event{
title: string;
start: Date|string;
allDay: boolean;
id: number;
}

export default function Home() {
  //const hello = await api.post.hello({ text: "from tRPC" });
  //const session = await getServerAuthSession();

  //void api.post.getLatest.prefetch();
  const[events, setEvents] = useState([
    {title: 'event 1', id: '1'}
  ])
  
  const[allEvents, setAllEvents] = useState<Event[]>([])
  const [showmodal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [idToDelete, setIdToDelete] = useState<number | null>(null)
  const[newEvent, setNewEvent] = useState<Event>({
    //pass this information to database?
    title: '',
    start: '',
    allDay: false,
    id: 0
  })

  function handleDateClick(arg: {date: Date, allDay: boolean}){
    setNewEvent({...newEvent, start: arg.date, allDay: arg.allDay, id: new Date().getTime()})
    setShowModal(true)}

  function handleDeleteModal(data: {event: {id:string}}){
    setShowDeleteModal(true);
    setIdToDelete(Number(data.event.id));
  }

  function handleDelete(){
    //filters through events and finds which one to delete
    //also delete event from database
    setAllEvents(allEvents.filter(event => Number(event.id) != Number(idToDelete)))
    setShowDeleteModal(false)
    setIdToDelete(null)
  }
  function handleCloseModal(){
    setShowModal(false)
    setNewEvent({
      title:"",
      start:"",
      allDay:false,
      id:0
    })
  }
   return (
    <div>
      <nav className = "flex justify-between mb-12 border-b border-violet-100 p-4">
        <h1 className="font-bold text-2x1 text-gray-700">
          Calendar
        </h1>"
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
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
                  right: 'resourceTimelineWork, dayGridMonth,timeGridWeek, timeGridDay'

                }}
                events={[]}
                nowIndicator={true}
                editable={true}
                droppable={true}
                selectable={true}
                selectMirror={true}
                dateClick={handleDateClick}
                eventClick={(data)=>handleDeleteModal(data)}

            />

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
      </main>
    </div>
  );
}
