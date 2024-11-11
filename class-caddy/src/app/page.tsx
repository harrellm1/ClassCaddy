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
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/16/solid";
import { set } from "zod";
import { EventSourceInput } from "@fullcalendar/core/index.js";

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
  const [showModal, setShowModal] = useState(false)
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

  function addEvent(data: DropArg){
    const event = {...newEvent, start: data.date.toISOString(), title:data.draggedEl.innerText, allDay: data.allDay, id:new Date().getTime()}
    setAllEvents([...allEvents, event])
  }

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewEvent({
      ...newEvent,
      title: e.target.value
    })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    setAllEvents([...allEvents, newEvent])
    setShowModal(false)
    setNewEvent({
      title:'',
      start:'',
      allDay: false,
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
                events={allEvents as EventSourceInput}
                nowIndicator={true}
                editable={true}
                droppable={true}
                selectable={true}
                selectMirror={true}
                dateClick={handleDateClick}
                drop={(data) => addEvent(data)}
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
          <Transition show={showModal} as ={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setShowModal}>
              <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
              </TransitionChild>
              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center p-4 text-center sm:items-center">
                  <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4">
                      <div>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white">
                          <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true"/>
                        </div>
                        <div className="mt-3 text-center sm:mt-5">
                          <DialogTitle as="h3" className="text-base front-semibold leading-6 text-gray-90">
                            Add Event
                          </DialogTitle>
                          <form action="submit" onSubmit={handleSubmit}>
                            <div className="mt-2">
                              <input type="text" name="title" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6" value={newEvent.title} onChange={(e) => handleChange(e)} placeholder="Title"/>
                            </div>
                            <div className="mt-5 sm:mt-6 sm:grid-flow-row-dense sm:grid-cols-2">
                              <button type="submit" className="inlne-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text:sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:col-start-2 disabled:opacity-25" disabled={newEvent.title ===''}>
                                Create
                              </button>
                              <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white" onClick={handleCloseModal}>
                                Cancel
                              </button>
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
