import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

let io: Server;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!io) {
    const server = (res.socket as any).server;

    if (server) {
      io = new Server(server, {
        cors: {
          origin: "*",
        },
      });

      io.on("connection", (socket) => {
        console.log("A user connected");

        socket.on("sendNotification", (data) => {
          console.log("Sending notification to clients:", data);
          io.emit("newNotification", data);
        });

        socket.on("disconnect", () => {
          console.log("A user disconnected");
        });
      });

      console.log("Socket.io server started");
    }
  }

  res.end();
}
