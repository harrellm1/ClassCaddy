import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

function incrementDate(date: Date, pattern: string): Date {
  const newDate = new Date(date);
  switch (pattern) {
    case "daily":
      newDate.setDate(newDate.getDate() + 1);
      break;
    case "weekly":
      newDate.setDate(newDate.getDate() + 7);
      break;
    case "monthly":
      newDate.setMonth(newDate.getMonth() + 1);
      break;
  }
  return newDate;
}



export const calEventRouter = createTRPCRouter({
  addEvent: publicProcedure.input(z.object({
    studentId: z.string(),
    title: z.string(),
    start: z.date(),
    end: z.date(),
    allDay: z.boolean(),
    tag: z.string(),
    recurrence: z.string().optional(),
    recurrenceEnd: z.date().optional()
  })).mutation(async ({ ctx, input }) => {
    const { ...eventData } = input;
    const recurrenceId = eventData.recurrence ? uuidv4() : null;
    // Save the event and generate recurring events if needed
    const events = [{ ...eventData, recurrenceId }];
    if (eventData.recurrence) {
      let currentStart = new Date(eventData.start);
      let currentEnd = new Date(eventData.end);

      while (currentStart <= new Date(eventData.recurrenceEnd!)) {
        currentStart = incrementDate(currentStart, eventData.recurrence);
        currentEnd = incrementDate(currentEnd, eventData.recurrence);
        if (currentStart <= new Date(eventData.recurrenceEnd!)) {
          events.push({ ...eventData, start: currentStart, end: currentEnd, recurrenceId });
        }
      }
    }

    const savedEvents = await ctx.db.calEvent.createMany({
      data: events,

    });
    return savedEvents;
  }),

  getEvents: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const userEvents = ctx.db.calEvent.findMany({
      where: {
        studentId: input
      }
    })

    return userEvents ?? null;
  }),

  getAcademicEvents: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const userAcademicEvents = ctx.db.calEvent.findMany({
      where: {
        studentId: input,
        tag: 'Academics'
      }
    })

    return userAcademicEvents ?? null;
  }),

  getAthleticEvents: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const userAthleticEvents = ctx.db.calEvent.findMany({
      where: {
        studentId: input,
        tag: 'Athletics'
      }
    })

    return userAthleticEvents ?? null;
  }),



  getPersonalEvents: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const userPersonalEvents = ctx.db.calEvent.findMany({
      where: {
        studentId: input,
        tag: 'Personal'
      }
    })

    return userPersonalEvents ?? null;
  }),

  getWorkEvents: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const userWorkEvents = ctx.db.calEvent.findMany({
      where: {
        studentId: input,
        tag: 'Work'
      }
    })

    return userWorkEvents ?? null;
  }),

  getAllClasses: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const classes = ctx.db.classTime.findMany({
      where: {
        studentId: input
      }
    })

    return classes ?? null


  }),

  deleteEvent: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    await ctx.db.calEvent.delete({
      where: {
        id: input
      }
    });

  }),



  editEvent: publicProcedure.input(z.object({
    id: z.string(),
    title: z.string(),
    start: z.date(),
    end: z.date(),
    allDay: z.boolean(),
    tag: z.string(),
  })).mutation(async ({ ctx, input }) => {
    // Find the event being edited
    const updatedEvent = await ctx.db.calEvent.update({
      where: { id: input.id },
      data: {
        title: input.title,
        start: input.start,
        end: input.end,
        allDay: input.allDay,
        tag: input.tag,
      },
    });

    return updatedEvent ?? null; // Return the updated event
  }),

  getSingleEvent: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const event = await ctx.db.calEvent.findUnique({
      where: {
        id: input
      }
    });

    return event ?? null;
  })
});

