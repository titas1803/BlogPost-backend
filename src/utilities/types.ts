import mongoose, { ObjectId } from "mongoose";
import { Request } from "express";

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
  password: string
  createdAt: Date;
  updatedAt: Date;
}

export interface INewUserReq {
  name: string;
  userName: string;
  photo: string;
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
  _id: ObjectId,
  title: string,
  content: string, // Main blog content
  authorId: ObjectId, // References the Users collection
  tags: string[], // List of tags (e.g., "tech", "lifestyle")
  categories: string[], // Categorization for the blog
  coverImage: string, // URL to cover image
  likes: number,
  commentsCount: number,
  isPublished: boolean,
  createdAt: Date,
  updatedAt: Date
}

export interface IComment extends Document {
  _id: ObjectId,
  postId: ObjectId, // References the Posts collection
  userId: ObjectId, // References the Users collection
  commentText: string,
  likes: number,
  createdAt: Date,
  updatedAt: Date
}

export interface ILoginReq {
  username: string,
  password: string
}

export interface ICustomRequest extends Request {
  user?: {
    userId: string;
    userName: string;
  }
}