import VUser from "@/models/User";
import Similarity from "compute-cosine-similarity";
import { connectToDatabase } from "../lib/db";

declare global {
  var io: any;
}

export async function matchUsers(userId: any) {
  try {
    if (!userId) return;
    await connectToDatabase();
    // console.log("User searching: ", user.isSearching);

    const interval = setInterval(async () => {
      const user = await VUser.findById(userId);
      if (!user || !user.isSearching) {
        clearInterval(interval);
        return;
      }
      const io = getIo();
      const candidates = await VUser.find({
        isSearching: true,
        _id: { $ne: user._id },
      });

      let bestMatch = null;
      let maxSimilarity = -1;
      
      for (const candidate of candidates) {
        const similarity = Similarity(user.embeddings, candidate.embeddings);
        if (similarity !== null && similarity > maxSimilarity) {
          maxSimilarity = similarity;
          bestMatch = candidate;
        }
      }
      // console.log(bestMatch, maxSimilarity, user._id, candidates);
      if (bestMatch && maxSimilarity > 0.5) {

        // console.log("************************Settitng falase: ", user._id, bestMatch._id);
        await VUser.updateMany(
          { _id: { $in: [user._id, bestMatch._id] } },
          { $set: { isSearching: false } }
        );

        console.log(user.socketId, bestMatch.socketId);
        io.to(user.socketId).emit("match", bestMatch.peerId);
        io.to(bestMatch.socketId).emit("match", user.peerId);

        clearInterval(interval);
      }
    }, 10000);
  } catch (err) {
    console.log(err);
  }
}

// function handleIo(io: any) {
//   io.on("connection", async (socket: any) => {
//     socket.on("join", async (userData: UserData) => {
//       const user: SocketUser | null = await User.findOneAndUpdate(
//         { peerId: userData.peerId },
//         { $set: { socketId: socket.id, isSearching: true } },
//         { new: true }
//       );
//       if (!user) return;
//       matchUsers(user);

//       socket.on("disconnect", async () => {
//         const user: SocketUser | null = await User.findOneAndUpdate(
//           { peerId: userData.peerId },
//           { $set: { socketId: socket.id, isSearching: false } },
//           { new: true }
//         );
//       });
//     });
//   });
// }

export function getIo() {
  if (!global.io) {
    throw new Error("Socket.io has not been initialized!");
  }
  return global.io;
}
