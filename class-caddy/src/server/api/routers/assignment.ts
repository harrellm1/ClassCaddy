import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const assignmentRouter = createTRPCRouter({
  createAssignment: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        dueDate: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.assignment.create({
        data: {
          title: input.title,
          description: input.description,
          dueDate: new Date(input.dueDate),
          userId: input.userId,
        },
      });
    }),

  getUserAssignments: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) throw new Error("Unauthorized");

    return await ctx.db.assignment.findMany({
      where: { userId },
      orderBy: { dueDate: "asc" },
    });
  }),

  updateAssignment: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        dueDate: z.string().optional(),
        completed: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.db.assignment.update({
        where: { id },
        data: {
          ...data,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        },
      });
    }),

    deleteAssignment: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.assignment.delete({
        where: { id: input.id },
      });
    }),
});
