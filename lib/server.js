import { Server } from "socket.io";
import Similarity from "compute-cosine-similarity";

let connectedUsers = [];

export default function createSocketServer(httpServer) {
  const io = new Server(httpServer);
  io.on("connection", (socket) => {
    socket.on("join", (user) => {
      if (!connectedUsers.some((u) => u.userId === user.userId)) {
        connectedUsers.push({
          socketId: socket.id,
          userId: user.userId,
          peerId: user.peerId,
          interest: user.interest,
        });
      } else {
        connectedUsers.forEach((u) => {
          if (u.userId === user.userId) {
            u.socketId = socket.id;
            u.userId = user.userId;
            u.peerId = user.peerId;
            u.interest = user.interest;
          }
          return u;
        });
      }
      io.emit("userList", connectedUsers);
    });
    
    socket.on("disconnect", () => {
      connectedUsers = connectedUsers.filter(
        (user) => user.socketId !== socket.id
      );
      io.emit("userList", connectedUsers);
    });
  });
  global.connectedUsers = connectedUsers;
  global.io = io;
}

export function getConnectedUsers() {
  return global.connectedUsers;
}

export function getIo() {
  return global.io;
}
