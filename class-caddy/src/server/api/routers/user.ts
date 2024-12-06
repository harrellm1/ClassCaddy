import { z } from "zod";
import { hash, verify } from "argon2";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  addStudent: publicProcedure.input(z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string(),
    password: z.string(),
  })).mutation(async ({ ctx, input }) => {
    const newUser = await ctx.db.student.create({
      data: {
        firstName: input.firstname,
        lastName: input.lastname,
        email: input.email,
        password: await hash(input.password),
        paidPlan: false
      },
    });

    //if user isn't successfully created return null
    return newUser ?? null;
  }),

  signIn: publicProcedure.input(z.object({
    useremail: z.string(),
    password: z.string()
  })).mutation(async ({ ctx, input }) => {
    const user = await ctx.db.student.findUnique({
      where: {
        email: input.useremail,
      }
    });

    //if no user, don't sign in to application
    if (!user) {
      return null;
    }

    //check input against hashed password
    const isValidPW = await verify(user.password, input.password);

    //if invalid password, don't sign in to application
    if (!isValidPW) {
      return null;
    }

    return user;
  }),

  getUser: publicProcedure.input(z.object({
    useremail: z.string(),
    password: z.string()
  })).mutation(async ({ ctx, input }) => {
    const user = await ctx.db.student.findUnique({
      where: {
        email: input.useremail,
        //password: input.password

      }
    });

    return user;
  }),

  deleteUser: publicProcedure.input(z.object({ useremail: z.string(), password: z.string() })).mutation(async ({ ctx, input }) => {
    return ctx.db.student.delete({
      where: {
        email: input.useremail
      }
    })
  }),

  subscribe: publicProcedure.input(z.object({ email: z.string(), password: z.string() })).mutation(async ({ ctx, input }) => {
    const getUser = await ctx.db.student.findUnique({
      where: {
        email: input.email
      }
    })

    if (getUser) {
      const validPW = await verify(getUser.password, input.password)
      if (validPW) {
        const plan = await ctx.db.student.update({
          where: {
            email: input.email
          },
          data: {
            paidPlan: true
          },
        });
        return plan ?? null;
      }
    }
    return null;

  }),

  editUser: publicProcedure.input(
    z.object({
      email: z.string(),
      firstname: z.string(),
      lastname: z.string().optional(),

    })
  ).mutation(async ({ ctx, input }) => {
    const foundUser = ctx.db.student.update({
      where: {
        email: input.email
      },

      data: {
        firstName: input.firstname,
        lastName: input.lastname,
        email: input.email,

      }
    })

    return foundUser ?? null;








  })
});
