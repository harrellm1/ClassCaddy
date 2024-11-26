import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const workScheduleRouter = createTRPCRouter({
  createJob: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.job.create({
        data: {
          name: input.name,
        },
      });
    }),

  getJobs: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.job.findMany();
  }),

  createShift: protectedProcedure
    .input(z.object({
      jobId: z.number(),
      weekId: z.number(),
      startTime: z.date(),
      endTime: z.date(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.shift.create({
        data: {
          jobId: input.jobId,
          weekId: input.weekId,
          startTime: input.startTime,
          endTime: input.endTime,
        },
      });
    }),

    getShiftsForWeek: protectedProcedure
    .input(z.object({ weekId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.shift.findMany({
        where: { weekId: input.weekId },
        include: {
          job: true,
        },
      });
    }),
  

  createWeek: protectedProcedure
    .input(z.object({
      name: z.string(),
      startDate: z.date(),
      endDate: z.date(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.week.create({
        data: {
          name: input.name,
          startDate: input.startDate,
          endDate: input.endDate,
        },
      });
    }),

  getWeeks: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.week.findMany();
  }),

  createHour: protectedProcedure
    .input(z.object({
      shiftId: z.number(),
      dayOfWeek: z.string(),
      startTime: z.date(),
      endTime: z.date(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.hour.create({
        data: {
          shiftId: input.shiftId,
          dayOfWeek: input.dayOfWeek,
          startTime: input.startTime,
          endTime: input.endTime,
        },
      });
    }),

  getHoursForShift: protectedProcedure
    .input(z.object({ shiftId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.hour.findMany({
        where: { shiftId: input.shiftId },
      });
    }),
});
