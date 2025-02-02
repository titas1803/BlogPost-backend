import mongoose from 'mongoose';
import { IComment } from '../utilities/types.js';

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Posts',
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    commentText: {
      type: String,
      requried: true,
    },
    likedBy: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.virtual('likes').get(function () {
  return this.likedBy.length;
});

const Comments = mongoose.model<IComment>('comments', commentSchema);
export default Comments;
