import { privateDecrypt } from "crypto";
import { z } from "zod";
import { argon2d, hash, verify } from "argon2";
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
          password: await hash(input.password),
          paidPlan: false,
        },
      });
      return newUser ?? null;
    }),

  signIn: publicProcedure.input(z.object({useremail: z.string(),
      password: z.string()
    })).mutation(async ({ ctx,input }) => {
      const user = await ctx.db.student.findUnique({
        where: {
          email: input.useremail,
        }
      });
      if(!user) {
        return null;
      }

      const isValidPW = await verify(user.password, input.password);
      if(!isValidPW) {
        return null;
      }
  
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
