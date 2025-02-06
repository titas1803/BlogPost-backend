import mongoose, { ObjectId } from 'mongoose';
import { Request } from 'express';

export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  userName: string;
  photo: string;
  phone: string;
  email: string;
  role: 'ADMIN' | 'USER';
  gender: 'male' | 'female';
  dob: Date;
  password: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
  // Virtual attribute
  noOfSubscribers?: {
    _id: '67993d0a7b28b3ee2fff64ba';
    authorId: '67993d0a7b28b3ee2fff64b6';
    subscribedBy: [];
    subscribedTo: [];
  };
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
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  //virtual attribute
  likes: number;
  commentsCount: number;
}

export interface IComment extends Document {
  _id: ObjectId;
  postId: ObjectId; // References the Posts collection
  authorId: ObjectId; // References the Users collection
  commentText: string;
  likedBy: string[];
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
