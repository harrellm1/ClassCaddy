import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const shiftRouter = createTRPCRouter({
    addShift: publicProcedure.input(z.object({
        studentId: z.string(),
        start: z.date(),
        end: z.date(),
        jobId: z.string(),
        notes: z.string().optional()
    })).mutation(async ({ ctx, input }) => {
        const newShiftCalEvent = await ctx.db.calEvent.create({
            data: {
                title: "Work Shift",
                student: {
                    connect: {
                        email: input.studentId
                    }
                },
                start: input.start,
                end: input.end,
                allDay: false,
                tag: 'Work'
            }
        })
        const newShift = await ctx.db.shift.create({
            data: {
                student: {
                    connect: {
                        email: input.studentId
                    }
                },
                job: {
                    connect: {
                        id: input.jobId
                    }
                },
                event: {
                    connect: {
                        id: newShiftCalEvent.id
                    }
                },
                start: input.start,
                end: input.end,
                notes: input.notes


            }
        });


        return newShift ?? null;

    }),

    updateShift: publicProcedure.input(z.object({
        id: z.string(),
        start: z.date(),
        end: z.date(),
        notes: z.string().optional()
    })).mutation(async ({ ctx, input }) => {
        const updatedShift = await ctx.db.shift.update({
            where: {
                id: input.id
            },
            data: {
                start: input.start,
                end: input.end,
                notes: input.notes

            }
        })

        const updatedShiftCalEvent = await ctx.db.calEvent.update({
            where: {
                id: updatedShift.eventId
            },

            data: {
                start: input.start,
                end: input.end
            }
        })

        return updatedShift ?? null;
    }),

    deleteShift: publicProcedure.input(z.object({
        id: z.string()

    })).mutation(async ({ ctx, input }) => {
        const getShift = await ctx.db.shift.findFirst({
            where: {
                id: input.id
            }
        });

        if (getShift) {
            await ctx.db.calEvent.delete({
                where: {
                    id: getShift.eventId
                }
            })

            return getShift;
        }

        return null;
    }),

    getUserShifts: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
        const shifts = ctx.db.shift.findMany({
            where: {
                studentId: input
            }
        })

        return shifts ?? null;
    })
});