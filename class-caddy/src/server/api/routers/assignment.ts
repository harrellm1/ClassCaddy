import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const assignmentRouter = createTRPCRouter({
  addAssignment: publicProcedure.input(z.object({
    email: z.string(),
    title: z.string(),
    description: z.string().optional(),
    courseId: z.string(),
    dueDate: z.date(),
    courseNum: z.string(),

  })).mutation(async ({ ctx, input }) => {

    //add assignment to user's academic calendar & use due date as start and end date for event
    const newAssignmentCalEvent = await ctx.db.calEvent.create({
      data: {
        title: input.title,
        student: {
          connect: {
            email: input.email
          }
        },
        start: input.dueDate,
        end: input.dueDate,
        allDay: false,
        tag: 'Academics'
      }
    })
    const assignment = await ctx.db.assignment.create({
      data: {

        title: input.title,
        description: input.description,
        dueDate: input.dueDate,
        courseNum: input.courseNum,


        course: {
          connect: {
            id: input.courseId
          }
        },

        student: {
          connect: {
            email: input.email
          }
        },
        event: {
          connect: {
            id: newAssignmentCalEvent.id
          }
        }

      },
    });



    return assignment ?? null;
  }),
  getAssignments: publicProcedure.input(
    z.string()
  ).mutation(async ({ ctx, input }) => {

    const allUserAssignments = await ctx.db.assignment.findMany({
      where: {
        studentId: input
      }
    })

    return allUserAssignments ?? null;
  }),

  deleteAssignmentsCourse: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const courseAssignments = await ctx.db.assignment.findMany({
      where: {
        id: input
      }
    });

    if (courseAssignments) {
      courseAssignments.map(async (assignment) => {
        console.log('assignment: ', assignment)
        await ctx.db.calEvent.delete({
          where: {
            id: assignment.eventId
          }

        })
      })
    }

    return courseAssignments


  }),

  deleteAssignment: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const getAssignment = await ctx.db.assignment.findFirst({
      where: {
        id: input
      }
    });
    if (getAssignment) {
      await ctx.db.calEvent.delete({
        where: {
          id: getAssignment.eventId
        }
      })

      return getAssignment;
    }

    return null;
  }),

  updateAssignment: publicProcedure.input(z.object({
    id: z.string(),
    dueDate: z.date(),
    name: z.string(),
    description: z.string().optional()
  })).mutation(async ({ ctx, input }) => {

    if (input.description) {
      const updatedAssignment = await ctx.db.assignment.update({
        where: {
          id: input.id
        },
        data: {
          title: input.name,
          dueDate: input.dueDate,
          description: input.description
        }
      });

      const updatedAssignmentCalEvent = await ctx.db.calEvent.update({
        where: {
          id: updatedAssignment.id
        },
        data: {
          title: input.name,
          start: input.dueDate,
          end: input.dueDate
        }
      });
      return updatedAssignment ?? null
    }

    else {
      const updatedAssignment = await ctx.db.assignment.update({
        where: {
          id: input.id
        },
        data: {
          title: input.name,
          dueDate: input.dueDate,
        }
      });

      const updatedAssignmentCalEvent = await ctx.db.calEvent.update({
        where: {
          id: updatedAssignment.id
        },
        data: {
          title: input.name,
          start: input.dueDate,
          end: input.dueDate
        }
      })

      return updatedAssignment ?? null
    }





  }),




});