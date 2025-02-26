import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  interests: { type: [String], required: true },
  embeddings: { type: [Number], required: true },
  isSearching: { type: Boolean, default: true },
  peerId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  socketId: { type: String },
});

console.log(mongoose.models);

export default mongoose.models.VUser || mongoose.model("VUser", UserSchema);
