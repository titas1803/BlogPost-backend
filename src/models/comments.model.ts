import mongoose from "mongoose";
import { IComment } from "../utilities/types.js";

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Posts"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users"
  },
  commentText: {
    type: String,
    requried: true,
  },
  likes: Number
}, {
  timestamps: true
});

const Comments = mongoose.model<IComment>("comments", commentSchema);
export default Comments;