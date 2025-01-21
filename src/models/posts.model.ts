import mongoose from "mongoose";
import { IPost } from "../utilities/types.js";
import Comments from "./comments.model.js";

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
    required: true,
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
  likedBy: {
    type: [String],
    default: []
  },
  isPublished: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

/**
 * Virtual columns
 */
postSchema.virtual('likes').get(function () {
  return this.likedBy.length;
});

postSchema.virtual('commentsCount').get(async function () {
  const comments = await Comments.find({ postId: this._id });
  if (comments) {
    return comments.length;
  }
  return 0;
});

const Posts = mongoose.model<IPost>('posts', postSchema);

export default Posts;