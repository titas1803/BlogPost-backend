import { ObjectId } from 'mongoose';
import { Request } from 'express';

export interface IUserDetails extends Document {
  _id: ObjectId;
  name: string;
  userName: string;
  photo: string;
  phone: string;
  email: string;
  role: 'ADMIN' | 'USER';
  gender: 'male' | 'female';
  dob: Date;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
  // Virtual attribute
  noOfSubscribers?: {
    _id: string;
    authorId: string;
    subscribedBy: string[];
    subscribedTo: string[];
  };
}

export interface IUser extends IUserDetails {
  password: string;
}

export interface INewUserReq {
  name: string;
  userName: string;
  phone: string;
  email: string;
  gender: 'male' | 'female';
  dob: string;
  password: string;
}

export interface ILogin extends Document {
  userId: ObjectId;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost extends Document {
  _id: ObjectId;
  title: string;
  content: string; // Main blog content
  authorId: ObjectId; // References the Users collection
  tags: string[]; // List of tags (e.g., "tech", "lifestyle")
  categories: string[]; // Categorization for the blog
  coverImage: string; // URL to cover image
  likedBy: string[];
  isPublished: string;
  createdAt: Date;
  updatedAt: Date;
  //virtual attribute
  likes: number;
  commentsCount: number;
}

export interface IPopulatedPost extends IPost {
  authorDetails?: {
    _id: string;
    name: string;
    userName: string;
  };
}

export interface IComment extends Document {
  _id: ObjectId;
  postId: ObjectId; // References the Posts collection
  authorId: ObjectId; // References the Users collection
  commentText: string;
  likedBy: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  // virtual attribute
  likes: number;
}

export interface ISubscriber extends Document {
  _id: ObjectId;
  authorId: ObjectId;
  subscribedBy: string[];
  subscribedTo: string[];
}

export interface ILoginReq {
  username: string;
  password: string;
}

export interface ICustomRequest extends Request {
  user?: {
    userId: string;
    userName: string;
  };
}
