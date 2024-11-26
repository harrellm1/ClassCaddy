import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Server } from "socket.io";

let io: Server;

const initializeSocketIO = (server: any) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*",
      },
    });
  }
  return io;
};

export const notificationRouter = createTRPCRouter({
  createNotification: protectedProcedure
    .input(z.object({ userId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const notification = await ctx.db.notification.create({
        data: { userId: input.userId, content: input.content },
      });

      if (io) {
        io.emit("new-notification", notification);
      }

      return notification;
    }),

  getNotifications: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) throw new Error("Unauthorized");
    return await ctx.db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }),

  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.notification.update({
        where: { id: input.notificationId },
        data: { read: true },
      });
    }),
});
