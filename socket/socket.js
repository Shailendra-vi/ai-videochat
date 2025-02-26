import { Server } from "socket.io";
// import { matchUsers, updateUser } from "../lib/utils";

// declare global {
//   var io: Server;
// }

export function createSocketServer(httpServer) {
  const io = new Server(httpServer);

  io.on("connection", async (socket) => {
    socket.on("join", async (userData) => {
      // const user = await User.findOneAndUpdate(
      //   { peerId: userData.peerId },
      //   { $set: { socketId: socket.id, isSearching: true } },
      //   { new: true }
      // );
      // const user =  await updateUser(userData.peerId, socket.id, true);
      // if(!user) return;
      // matchUsers(user);
      console.log("User joined", userData);
    });
    socket.on("connect", ()=>{
      console.log("Client connected:", socket.id);
    })
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
  global.io = io;
}

