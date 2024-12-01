import { z } from "zod";

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
    addEvent:publicProcedure.input(z.object({
        studentId: z.string(),
        title:  z.string(),
        start: z.date(),
        end: z.date(),
        allDay: z.boolean(),
        tag: z.string(),
        recurrence: z.string().optional(),
        recurrenceEnd: z.date().optional()
    })).mutation(async({ctx,input}) => {
      const { recurrence, recurrenceEnd, ...eventData } = input;
      // Save the event and generate recurring events if needed
      const events = [eventData];
      if (recurrence) {
        let currentStart = new Date(eventData.start);
        let currentEnd = new Date(eventData.end);
  
        while (currentStart <= new Date(recurrenceEnd!)) {
          currentStart = incrementDate(currentStart, recurrence);
          currentEnd = incrementDate(currentEnd, recurrence);
          if (currentStart <= new Date(recurrenceEnd!)) {
            events.push({ ...eventData, start: currentStart, end: currentEnd });
          }
        }
      }
  
      const savedEvents = await ctx.db.calEvent.createMany({
        data: events,
        
      });
      return savedEvents;
    }),

    getEvents: publicProcedure.input(z.string()).mutation(async({ctx,input}) => {
      const userEvents = ctx.db.calEvent.findMany({
        where: {
          studentId:input
        }
      })

      return userEvents ?? null;
    }),


    getAllClasses: publicProcedure.input(z.string()).mutation(async({ctx,input}) => {
      const classes = ctx.db.classTime.findMany({
        where: {
          studentId: input
        }
      })

      return classes ?? null


    }),

    deleteEvent: publicProcedure.input(z.string()).mutation(async({ctx, input}) => {
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
    })).mutation(async({ctx,input})=> {
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
        return updatedEvent;
    }),

    getSingleEvent: publicProcedure.input(z.string()).mutation(async({ctx,input}) => {
      const event = await ctx.db.calEvent.findUnique({
        where: {
          id: input
        }
      });

      return event??null;
    })



    


 
});

