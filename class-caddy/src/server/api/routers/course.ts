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
    }),

    updateCourse: publicProcedure.input(z.object({
      id: z.string(),
      courseName: z.string(),
      courseNumber: z.string(),
      courseInstructor: z.string()
    })).mutation(async({ctx,input}) => {
      const updatedCourse =  await ctx.db.course.update({
        where: {
          id: input.id
        },
        data: {
          courseName: input.courseName,
          courseNumber: input.courseNumber,
          courseInstructor: input.courseInstructor
        }
      })

      return updatedCourse ?? null;
    }),

    getCourseFromId: publicProcedure.input(z.object({
      id: z.string(),
      email: z.string()
    })).mutation(async({ctx,input}) => {
      const course = ctx.db.course.findFirst({
        where: {
          studentId:input.email,
          id:input.id
        }
      })

      return course ?? null;
    }),

    deleteCourse: publicProcedure.input(z.string()).mutation(async({ctx,input})=> {
      const deletedAssignments =  await ctx.db.assignment.deleteMany({
        where: {
          courseId:input
        }
      });

      const deletedcourse = await ctx.db.course.delete({
        where:{
          id: input
        }
      })

      return deletedcourse ?? null;
  
  
  
  })
});
