import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  let connectedUsers = [];

  io.on("connection", (socket) => {
    socket.on("join", (user) => {
      if (!connectedUsers.some((u) => u.userId === user.userId)) {
        connectedUsers.push({
          socketId: socket.id,
          userId: user.userId,
          peerId: user.peerId,
        });
        io.emit("userList", connectedUsers);
      }
    });

    socket.on("disconnect", () => {
      connectedUsers = connectedUsers.filter(
        (user) => user.socketId !== socket.id
      );
      io.emit("userList", connectedUsers);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
