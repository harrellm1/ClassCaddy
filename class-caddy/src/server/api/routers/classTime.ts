import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const classRouter = createTRPCRouter({
    addClass:publicProcedure.input(z.object({
        email: z.string(),
        courseId: z.string(),
        period: z.number(),
        day: z.number()
    })).mutation(async({ctx,input}) => {
      return ctx.db.classTime.create({
        data: {
          Period: input.period,
          day: input.day,
          
          course:{
              connect: {
                id:input.courseId
              }
          },

          student: {
            connect: {
              email: input.email
            }
          }

        },
      });
    }),

    getClassesDay: publicProcedure.input(z.object({

      email: z.string(),
      day: z.number()
  })).mutation(async({ctx,input}) => {
      const courseTimes = ctx.db.classTime.findMany({
        where: {
          studentId: input.email,
          day: input.day
        }
      })

      return courseTimes ?? null;
    }),

    getAllClasses: publicProcedure.input(z.string()).mutation(async({ctx,input}) => {
      const allCourses = ctx.db.classTime.findMany({
        where: {
          studentId: input
        }
      })

      return allCourses ?? null


    })

 
});

