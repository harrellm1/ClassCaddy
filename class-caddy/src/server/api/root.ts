import { userRouter } from "~/server/api/routers/user";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { courseRouter } from "./routers/course";
import { calEventRouter } from "./routers/calEvent";
import { assignmentRouter } from "./routers/assignment";
import { jobRouter } from './routers/job';
import { shiftRouter } from "./routers/shift";
import { practiceRouter } from "./routers/practice";
import { sportsRouter } from "./routers/sport";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  course: courseRouter,
  calEvent: calEventRouter,
  assignment: assignmentRouter,
  job: jobRouter,
  shift: shiftRouter,
  practice: practiceRouter,
  sport: sportsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
