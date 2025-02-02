import mongoose, { CallbackError } from 'mongoose';
import validator from 'validator';
import { IUser } from '../utilities/types.js';
import Login from './login.model.js';
import ErrorHandler from '../utilities/Error.class.js';
import Posts from './posts.model.js';
import Comments from './comments.model.js';
import Subscribers from './subscribers.model.js';

export const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      trim: true,
      unique: [true, 'Email already exists'],
      lowercase: true,
      validate: validator.default.isEmail,
    },
    phone: {
      type: String,
      required: [true, 'Please enter your phone number'],
      trim: true,
      unique: [true, 'Phone number already exists'],
      lowercase: true,
      validate: validator.default.isMobilePhone,
    },
    photo: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER'],
      default: 'USER',
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: [true, 'Please enter your gender'],
    },
    dob: {
      type: Date,
      required: [true, 'Please enter date'],
    },
    userName: {
      type: String,
      required: [true, 'Choose a unique username'],
      unique: [true, 'Username already exists'],
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

userSchema.virtual('noOfSubscribers', {
  ref: 'Subscribers', // Reference to the Subscribers model
  localField: '_id', // Match user _id
  foreignField: 'authorId', // Find in Subscribers where authorId = user._id
  justOne: true, // Ensure it returns a single document
});

// Count of people this user has subscribed to
userSchema.virtual('noOfSubscribedTo', {
  ref: 'Subscribers', // Reference to the Subscribers model
  localField: '_id', // Match user _id
  foreignField: 'authorId', // Find subscriptions where user is the subscriber
  justOne: true, // Ensure it returns a single document
});

userSchema.post('save', async function (doc, next) {
  try {
    const user = this as mongoose.Document & { password?: string };

    if (!user.password) {
      throw new ErrorHandler('Password is required for creating login data.');
    }

    const loginDetails = new Login({
      userId: doc._id,
      password: user.password ?? 'Demo@123',
    });
    await loginDetails.save();
    const subScriberDetails = new Subscribers({ authorId: doc._id });
    subScriberDetails.save();
  } catch (error) {
    // If loginDetails creation fails, delete the user document
    await this.model('Users').deleteOne({ _id: doc._id });
    next(new ErrorHandler('Internal error'));
  }
});

userSchema.pre('findOneAndDelete', async function (next) {
  try {
    const userId = this.getQuery()._id;
    const deletedSubscriber = await Subscribers.deleteOne({ authorId: userId });
    if (!deletedSubscriber.acknowledged)
      throw new ErrorHandler('Unable to delete subscribers details');
    const deletedLogin = await Login.deleteOne({ userId });
    if (!deletedLogin.acknowledged)
      throw new ErrorHandler('Unable to delete user');
    const postIds = await Posts.find({ authorId: userId }).select('_id');
    const deletedCommentsByUserId = await Comments.deleteMany({
      authorId: userId,
    });
    if (!deletedCommentsByUserId.acknowledged)
      throw new ErrorHandler("Unable to delete user's Comments");
    const deletedCommentsFromPosts = await Comments.deleteMany({
      postId: { $in: postIds },
    });
    if (!deletedCommentsFromPosts.acknowledged)
      throw new ErrorHandler("Unable to delete Comments from user's post");
    const deletedPosts = await Posts.deleteMany({ authorId: userId });
    if (!deletedPosts.acknowledged)
      throw new ErrorHandler("Unable to delete user's posts");
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

userSchema.post('findOneAndDelete', async function (next) {
  const userId = this.getQuery()._id;
  const subscribedTo = await Subscribers.find({
    subscribedBy: { $in: [userId] },
  });
  if (subscribedTo.length) {
    subscribedTo.forEach(async (user) => {
      await user.updateOne({ $pull: { subscribedBy: userId } });
    });
  }
});

const Users = mongoose.model<IUser>('Users', userSchema);

Users.init()
  .then(() => {
    console.log('Users index created successfully');
  })
  .catch((err) => {
    console.log('Error Occured', err);
  });

export default Users;
