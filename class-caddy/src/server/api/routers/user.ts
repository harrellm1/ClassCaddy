import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    addStudent:publicProcedure.input(z.object({
      firstname:z.string(),
      lastname: z.string(),
      email: z.string(),
      password: z.string(),
    })).mutation(async({ctx,input}) => {
      const newUser = await ctx.db.student.create({
        data: {
          firstName: input.firstname,
          lastName: input.lastname,
          email: input.email,
          password: input.password
        },
      });
      return newUser ?? null;
    }),

  getUser: publicProcedure.input(z.object({useremail: z.string(),
      password: z.string()
    })).mutation(async ({ ctx,input }) => {
      const user = await ctx.db.student.findUnique({
        where: {
          email: input.useremail,
          //password: input.password

        }
      });
  
      return user;
    }),

    deleteUser:publicProcedure.input(z.object({useremail: z.string(), password:z.string()})).mutation(async({ctx,input}) =>{
      return ctx.db.student.delete({
        where: {
          email: input.useremail
        }
      })
    }),
});
