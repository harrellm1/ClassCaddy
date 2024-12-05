import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { startOfWeek, endOfWeek } from 'date-fns';
import { DefaultDeserializer } from "v8";

export const assignmentRouter = createTRPCRouter({
  addAssignment:publicProcedure.input(z.object({
    email: z.string(),
    title: z.string(),
    desscription: z.string().optional(),
    courseId: z.string(),
    dueDate: z.date(),
    courseNum: z.string()
})).mutation(async({ctx,input}) => {
  const assignment= await ctx.db.assignment.create({
    data: {
      
      title: input.title,
      description: input.desscription,
      dueDate: input.dueDate,
      courseNum: input.courseNum,
      
      
      course:{
          connect: {
            id:input.courseId
          }
      },

      student: {
        connect: {
          email: input.email
        }
      }

    },
  });

  return assignment ?? null;
}),
getAssignments: publicProcedure.input(
  z.string()
).mutation(async({ctx,input}) => {

  const allUserAssignments = await ctx.db.assignment.findMany({
    where: {
        studentId:input
    }
  })

  return allUserAssignments ?? null;
}),

deleteAssignmentsCourse: publicProcedure.input(z.string()).mutation(async({ctx,input})=> {
    return await ctx.db.assignment.deleteMany({
      where: {
        courseId:input
      }
    })



})
});