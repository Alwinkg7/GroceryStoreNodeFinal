import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: String, required: true },
  name: { type: String, required: true }, 
  likes: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Post", postSchema);
