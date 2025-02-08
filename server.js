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

  let streams = [];

  io.on("connection", (socket) => {
    socket.on("call", ({ userId, stream }) => {
      !streams.some((stream) => stream.socketId === socket.id) &&
        streams.push({ socketId: socket.socketId, userId, stream });
      io.emit("newCall", streams);
    });

    socket.on("disconnect", () => {
      streams = streams.filter((stream) => stream.socketId !== socket.id);
      io.emit("newCall", streams);
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
