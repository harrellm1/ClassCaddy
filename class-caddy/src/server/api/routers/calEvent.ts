import { z } from "zod";
import {v4 as uuidv4} from 'uuid';
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

const adjustTimeForRecurrence = (start: Date, end: Date, recurrencePattern: string): { start: Date, end: Date } => {
  const adjustedStart = new Date(start);
  const adjustedEnd = new Date(end);

  switch (recurrencePattern) {
    case 'daily':
      // For daily recurrence, keep the same time on the next day
      adjustedStart.setDate(adjustedStart.getDate() + 1);
      adjustedEnd.setDate(adjustedEnd.getDate() + 1);
      break;
    case 'weekly':
      // For weekly recurrence, keep the same time on the next week
      adjustedStart.setDate(adjustedStart.getDate() + 7);
      adjustedEnd.setDate(adjustedEnd.getDate() + 7);
      break;
    case 'monthly':
      // For monthly recurrence, keep the same time next month
      adjustedStart.setMonth(adjustedStart.getMonth() + 1);
      adjustedEnd.setMonth(adjustedEnd.getMonth() + 1);
      break;
    default:
      // No adjustment for no recurrence pattern
      break;
  }

  return { start: adjustedStart, end: adjustedEnd };
};


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
      const { ...eventData } = input;
      const recurrenceId = eventData.recurrence ? uuidv4(): null;
      // Save the event and generate recurring events if needed
      const events = [{...eventData, recurrenceId}];
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

    getEvents: publicProcedure.input(z.string()).mutation(async({ctx,input}) => {
      const userEvents = ctx.db.calEvent.findMany({
        where: {
          studentId:input
        }
      })

      return userEvents ?? null;
    }),

    getAcademicEvents: publicProcedure.input(z.string()).mutation(async({ctx,input}) => {
      const userAcademicEvents = ctx.db.calEvent.findMany({
        where: {
          studentId:input,
          tag: 'Academics'
        }
      })

      return userAcademicEvents ?? null;
    }),

    getPersonalEvents: publicProcedure.input(z.string()).mutation(async({ctx,input}) => {
      const userPersonalEvents = ctx.db.calEvent.findMany({
        where: {
          studentId:input,
          tag: 'Personal'
        }
      })

      return userPersonalEvents ?? null;
    }),

    getWorkEvents: publicProcedure.input(z.string()).mutation(async({ctx,input}) => {
      const userWorkEvents = ctx.db.calEvent.findMany({
        where: {
          studentId:input,
          tag: 'Work'
        }
      })

      return userWorkEvents ?? null;
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

    // editEvent: publicProcedure.input(z.object({
    //   id: z.string(),
    //   title: z.string(),
    //   start: z.date(),
    //   end: z.date(),
    //   allDay: z.boolean(),
    //   tag: z.string(),
    //   editAll: z.boolean()
    // })).mutation(async({ctx,input})=> {

    //   const event = await ctx.db.calEvent.findUnique({
    //     where: { id: input.id },
    //   });

    //   if(!event) {
    //     return null;
    //   }

    //   if (input.editAll && event.recurrenceId) {
    //     // Find all events with the same recurrence ID
    //     const allRecurrences = await ctx.db.calEvent.findMany({
    //       where: {
    //         recurrenceId: event.recurrenceId, // Match the recurrence ID
    //       },
    //     });

    //       // Update all recurrence events
    //   const updatedEvents = await Promise.all(allRecurrences.map(async (recEvent) => {
    //     let adjustedStart = input.start;
    //     let adjustedEnd = input.end;

    //     // Adjust start and end based on recurrence pattern
    //     if (event.recurrence) {
    //       const adjustedTimes = adjustTimeForRecurrence(adjustedStart, adjustedEnd, event.recurrence);
    //       adjustedStart = adjustedTimes.start;
    //       adjustedEnd = adjustedTimes.end;
    //     }

    //     // Update each recurrence event
    //     return await ctx.db.calEvent.update({
    //       where: { id: recEvent.id },
    //       data: {
    //         title: input.title,
    //         start: adjustedStart,
    //         end: adjustedEnd,
    //         allDay: input.allDay,
    //         tag: input.tag,
    //       },
    //     });
    //   }));

    //   return updatedEvents; // Return the updated events
    // } 
    // else {
    //   // If we're only editing a single event, just update that specific event
    //   const updatedEvent = await ctx.db.calEvent.update({
    //     where: { id: input.id },
    //     data: {
    //       title: input.title,
    //       start: input.start,
    //       end: input.end,
    //       allDay: input.allDay,
    //       tag: input.tag,
    //     },
    //   });

    //   return updatedEvent; // Return the updated event
    // }



   
    // }),

    editEvent: publicProcedure.input(z.object({
      id: z.string(),
      title: z.string(),
      start: z.date(),
      end: z.date(),
      allDay: z.boolean(),
      tag: z.string(),
      recurrenceId: z.string().optional(), // Optional: for handling recurrence updates
      updateAllRecurrences: z.boolean().default(false), // Flag to indicate whether to update all occurrences
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

    getSingleEvent: publicProcedure.input(z.string()).mutation(async({ctx,input}) => {
      const event = await ctx.db.calEvent.findUnique({
        where: {
          id: input
        }
      });

      return event??null;
    })
});

