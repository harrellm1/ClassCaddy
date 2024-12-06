import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const practiceRouter = createTRPCRouter({
    addPractice: publicProcedure.input(z.object({
        studentId: z.string(),
        start: z.date(),
        end: z.date(),
        sportId: z.string(),
        notes: z.string().optional()
    })).mutation(async ({ ctx, input }) => {
        const newPracticeCalEvent = await ctx.db.calEvent.create({
            data: {
                title: "Team Practice",
                student: {
                    connect: {
                        email: input.studentId
                    }
                },
                start: input.start,
                end: input.end,
                allDay: false,
                tag: 'Athletics'
            }
        })
        const newPractice = await ctx.db.practice.create({
            data: {
                student: {
                    connect: {
                        email: input.studentId
                    }
                },
                sport: {
                    connect: {
                        id: input.sportId
                    }
                },
                event: {
                    connect: {
                        id: newPracticeCalEvent.id
                    }
                },
                start: input.start,
                end: input.end,
                notes: input.notes



            }
        });


        return newPractice ?? null;

    }),

    updatePractice: publicProcedure.input(z.object({
        id: z.string(),
        start: z.date(),
        end: z.date(),
        notes: z.string().optional()
    })).mutation(async ({ ctx, input }) => {
        const updatedPractice = await ctx.db.practice.update({
            where: {
                id: input.id
            },
            data: {
                start: input.start,
                end: input.end,
                notes: input.notes
            }
        });


        //update calendar events
        await ctx.db.calEvent.update({
            where: {
                id: updatedPractice.eventId
            },

            data: {
                start: input.start,
                end: input.end
            }
        })

        return updatedPractice ?? null;
    }),

    deletePractice: publicProcedure.input(z.object({
        id: z.string()

    })).mutation(async ({ ctx, input }) => {
        const getPractice = await ctx.db.practice.findFirst({
            where: {
                id: input.id
            }
        });

        if (getPractice) {
            await ctx.db.calEvent.delete({
                where: {
                    id: getPractice.eventId
                }
            })

            return getPractice;
        }

        return null;
    }),

    getUserPractices: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
        const practices = ctx.db.practice.findMany({
            where: {
                studentId: input
            }
        })

        return practices ?? null;
    })
});