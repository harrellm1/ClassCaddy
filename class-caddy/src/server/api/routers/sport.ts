import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const sportsRouter = createTRPCRouter({
    addSport: publicProcedure.input(z.object({
        studentId: z.string(),
        sportName: z.string(),
        teamName: z.string(),
        coach: z.string(),
        coachPhone: z.string(),
        coachEmail: z.string(),
    })).mutation(async ({ ctx, input }) => {
        const newSport = await ctx.db.sport.create({
            data: {
                sportName: input.sportName,
                teamName: input.teamName,
                Coach: input.coach,
                coachPhone: input.coachPhone,
                coachEmail: input.coachEmail,
                student: {
                    connect: {
                        email: input.studentId
                    }
                }


            }
        });
        return newSport ?? null;

    }),

    checkUserSport: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
        const userSport = await ctx.db.sport.findUnique({
            where: {
                studentId: input
            }
        })

        return userSport ?? null;
    }),

    updateSport: publicProcedure.input(z.object({
        email: z.string(),
        sportName: z.string(),
        teamName: z.string(),
        coachName: z.string(),
        coachPhone: z.string(),
        coachEmail: z.string()
    })).mutation(async ({ ctx, input }) => {
        const updatedSport = await ctx.db.sport.update({
            where: {
                studentId: input.email
            },
            data: {
                sportName: input.sportName,
                teamName: input.teamName,
                Coach: input.coachName,
                coachPhone: input.coachPhone,
                coachEmail: input.coachEmail,
            }
        })
    })
});