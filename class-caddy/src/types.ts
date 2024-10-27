import {z} from 'zod';

export const courseInput =  z.object({
    courseName: z.string(
        {required_error: 'enter course name'
        }
    ),
    courseInstructor: z.string(),
    courseCode: z.string(),
})