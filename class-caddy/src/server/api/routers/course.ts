import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const courseRouter = createTRPCRouter({
    addCourse:publicProcedure.input(z.object({
      studentEmail:z.string(),
      courseName: z.string(),
      courseInstructor: z.string(),
      courseNumber: z.string(),
      semester: z.string(),
      year: z.number()
    })).mutation(async({ctx,input}) => {

      const foundCourse = await ctx.db.course.findFirst({where: {
        studentId: input.studentEmail,
        courseNumber:input.courseNumber
      }}
          
     
      )

      if(foundCourse) {
        return null;
      }
      const newCourse = await ctx.db.course.create({
        data: {
          courseNumber: input.courseNumber,
          courseName: input.courseName,
          courseInstructor: input.courseInstructor,
          Semester: input.semester,
          Year: input.year,
          student:{
              connect: {
                email:input.studentEmail
              }
          }

        },
      });

      return newCourse ?? null;
    }),

  getCourses: publicProcedure.input(z.string()).mutation(async ({ ctx,input }) => {
      const courses = await ctx.db.course.findMany({
        where: {
          studentId:input

        }
      });
  
      return courses ?? null;
    }),

    getCourseName: publicProcedure.input(z.string()).mutation(async ({ ctx,input }) => {
      const course = await ctx.db.course.findUnique({
        where: {
          id:input

        }
      });

      if(course) {
        return course.courseNumber
      }
      return null
    }),

    getSingleCourse: publicProcedure.input(z.object({email: z.string(), number: z.string()})).mutation(async({ctx,input}) => {
        const course = await ctx.db.course.findFirst({
          where: {
            studentId: input.email,
            courseNumber: input.number
          }
        })

        return course ?? null;
    })
});
