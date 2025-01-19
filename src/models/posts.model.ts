import mongoose from "mongoose";
import { IPost } from "../utilities/types.js";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    requrired: true,
    trim: true,
  },
  content: {
    type: String,
    requred: true,
    trim: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  tags: {
    type: [String],
    default: []
  },
  categories: {
    type: [String],
    default: []
  },
  image: {
    type: [String],
    default: []
  },
  likes: Number,
  isPublished: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

const Posts = mongoose.model<IPost>('posts', postSchema);

export default Posts;