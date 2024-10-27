import { z } from "zod";
import { courseInput } from "~/types";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { connect } from "http2";

export const courseRouter = createTRPCRouter({
  getCoursesbyUser:protectedProcedure.query(async({ctx}) => {
    const courses =  ctx.db.course.findMany({
     where: {
        studentId:ctx.session.user.id
     },
    });

    return courses;
  }),

createCourse:protectedProcedure.input(courseInput).mutation(async({ctx, input}) => {
  return ctx.db.course.create({
    data: {
      courseName: input.courseName,
      courseInstructor: input.courseInstructor,
      courseNumber: input.courseCode,
      student: {
        connect: {
          id: ctx.session.user.id
        }
      }
    }    
  });
}),

deleteCourse:protectedProcedure.input(z.number()).mutation(async({ctx, input}) => {
  return ctx.db.course.delete({
   where:{
    id:input
   }  
  });
}),     

});
