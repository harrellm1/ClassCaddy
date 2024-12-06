import { z } from "zod";
import {v4 as uuidv4} from 'uuid';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const jobRouter = createTRPCRouter({
    addJob:publicProcedure.input(z.object({
        studentId: z.string(),
        title:  z.string(),
        supervisor: z.string(),
        jobPhone: z.string(),
        jobEmail: z.string(),
    })).mutation(async({ctx,input}) => {
        const newJob = await ctx.db.job.create({
            data: {
                jobTitle: input.title,
                supervisor: input.supervisor,
                jobPhone: input.jobPhone,
                jobEmail: input.jobEmail,
                student: {
                    connect: {
                        email: input. studentId
                    }
                }
            

            }
        });
        return newJob ?? null;
        
    }),

    checkUserJob: publicProcedure.input(z.string()).mutation(async({ctx,input}) => {
        const userJob = await ctx.db.job.findUnique({
            where: {
                studentId: input
            }
        })

        return userJob??null;
    }),

    updateJob: publicProcedure.input(z.object({
        email: z.string(),
        title: z.string()
    })).mutation(async({ctx,input}) => {
        const updatedJob = await ctx.db.job.update({
            where: {
                studentId:input.email
            },
            data: {
                jobTitle: input.title
            }
        })
    })   
});