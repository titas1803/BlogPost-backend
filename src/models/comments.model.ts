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
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

commentSchema.virtual('authorDetails', {
  ref: 'Users', // Reference to the Subscribers model
  localField: 'authorId', // Match Post authorId
  foreignField: '_id', // Find in users where authorId = user._id
  justOne: true, // Ensure it returns a single document
});

commentSchema.virtual('likes').get(function () {
  return this.likedBy.length;
});

const Comments = mongoose.model<IComment>('comments', commentSchema);
export default Comments;
