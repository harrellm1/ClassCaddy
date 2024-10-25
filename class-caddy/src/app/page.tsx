"use client"
import Link from "next/link";
import React, { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, {Draggable, DropArg} from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'

import { LatestPost } from "~/app/_components/post";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

interface Event{
title: string;
start: Date|string;
allDay: boolean;
id: number;
}

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  void api.post.getLatest.prefetch();
  const[events, setEvents] = useState([
    {title: 'event 1', id: '1'}
  ])
  const[allEvents, setAllEvents] = useState<Event[]>([])
  const [showmodal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [idToDelete, setIdToDelete] = useState<number | null>(null)
  const[newEvent, setNewEvent] = useState<Event>({
    title: '',
    start: '',
    allDay: false,
    id: 0
  })

  function handleDateClick(arg: {date: Date, allDay: boolean}){
    setNewEvent({...newEvent, start: arg.date, allDay: arg.allDay, id: new Date().getTime()})
    setShowModal(true)}

    function addEvent(data:DropArg){
      const event= (...newEvent, start: data.date.toISOString(), title: data.draggedEl.innerText, allDay: data.allDay, id: new Date().getTime())
      setAllEvents([...allEvents, event])
    }
   return (
    <HydrateClient>
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
                events={allEvents}
                nowIndicator={true}
                editable={true}
                droppable={true}
                selectable={true}
                selectMirror={true}
                dateClick={handleDateClick}
                drop={(data)=> addEvent(data)}
                eventClick={(data)=>handleDeleteModal(data)}

            />

          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
