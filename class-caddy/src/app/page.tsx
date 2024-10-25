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
                events={[]}
                nowIndicator={true}
                editable={true}
                droppable={true}
                selectable={true}
                selectMirror={true}
                //dateClick={{}}
                //drop={}

            />

          </div>
          <div id="draggable-el" className="ml-8 w-full border-2 p-2 rounded-md mt-16 lg:h-1/2 bg-violet-50">
                <h1 className="font-bold text-lg text-center">Drag Event</h1>
                {events.map(event =>(
                  <div
                    className="fc-event border-2 p-1 m-2 w-full rounded-md ml-auto text-center bg-white"
                    title={event.title}
                    key={event.id}>
                      {event.title}
                      </div>
                ))}
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
