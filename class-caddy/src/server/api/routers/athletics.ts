import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const athleticsRouter = createTRPCRouter({
  addEvent: protectedProcedure
    .input(z.object({
      name: z.string(),
      date: z.date(),
      location: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.event.create({ data: input });
    }),

  logMeal: protectedProcedure
    .input(z.object({
      athleteId: z.number(),
      date: z.date(),
      meal: z.string(),
      calories: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.mealLog.create({ data: input });
    }),

  addProcedure: protectedProcedure
    .input(z.object({
      athleteId: z.number(),
      procedure: z.string(),
      date: z.date(),
      completed: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.procedure.create({ data: input });
    }),

  getEvents: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.event.findMany({
      orderBy: { date: "asc" },
    });
  }),

  getAthleteLogs: protectedProcedure
    .input(z.object({ athleteId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.mealLog.findMany({
        where: { athleteId: input.athleteId },
        orderBy: { date: "desc" },
      });
    }),

  getProcedures: protectedProcedure
    .input(z.object({ athleteId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.procedure.findMany({
        where: { athleteId: input.athleteId },
        orderBy: { date: "asc" },
      });
    }),

  markProcedureCompleted: protectedProcedure
    .input(z.object({ procedureId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.procedure.update({
        where: { id: input.procedureId },
        data: { completed: true },
      });
    }),
});
