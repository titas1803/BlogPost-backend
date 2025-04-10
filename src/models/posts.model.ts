import mongoose, { CallbackError } from 'mongoose';
import { IPost } from '../utilities/types.js';
import Comments from './comments.model.js';
import ErrorHandler from '../utilities/Error.class.js';

const postSchema = new mongoose.Schema(
  {
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
      ref: 'Users',
    },
    tags: {
      type: [String],
      default: [],
    },
    categories: {
      type: [String],
      default: [],
    },
    image: {
      type: [String],
      default: [],
    },
    likedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Users',
      default: [],
    },
    isPublished: {
      type: String,
      enum: ['true', 'false'],
      default: 'false',
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

/**
 * Virtual columns
 */
postSchema.virtual('likes').get(function () {
  return this.likedBy.length;
});

postSchema.virtual('commentsCount', {
  ref: 'comments', // Reference to the Subscribers model
  localField: '_id', // Match user _id
  foreignField: 'postId', // Find subscriptions where user is the subscriber
  count: true,
});

postSchema.virtual('authorDetails', {
  ref: 'Users', // Reference to the Subscribers model
  localField: 'authorId', // Match Post authorId
  foreignField: '_id', // Find in users where authorId = user._id
  justOne: true, // Ensure it returns a single document
});

postSchema.pre('findOneAndDelete', async function (next) {
  try {
    const postId = this.getQuery()._id;
    const deletedComments = await Comments.deleteMany({ postId });
    if (!deletedComments.acknowledged)
      throw new ErrorHandler("Unable to delete user's posts");
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

const Posts = mongoose.model<IPost>('posts', postSchema);

export default Posts;
