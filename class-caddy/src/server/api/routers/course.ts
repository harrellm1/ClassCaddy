import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const courseRouter = createTRPCRouter({
    addCourse:publicProcedure.input(z.object({
      studentEmail:z.string(),
      courseName: z.string(),
      courseInstructor: z.string(),
      courseNumber: z.string(),
    })).mutation(async({ctx,input}) => {
      return ctx.db.course.create({
        data: {
          courseNumber: input.courseNumber,
          courseName: input.courseName,
          courseInstructor: input.courseInstructor,
          student:{
              connect: {
                email:input.studentEmail
              }
          }

        },
      });
    }),

  getCourses: publicProcedure.input(z.string()).query(async ({ ctx,input }) => {
      const courses = await ctx.db.student.findMany({
        where: {
          email:input

        }
      });
  
      return courses ?? null;
    }),
});
