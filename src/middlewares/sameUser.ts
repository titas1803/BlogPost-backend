import { NextFunction, Response } from "express"
import { ICustomRequest } from "../utilities/types.js"
import ErrorHandler from "../utilities/Error.class.js"
import Posts from "../models/posts.model.js";

export const sameUsersPostVerification = async (req: ICustomRequest, _res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new ErrorHandler("Please login", 401);
    const postId = req.params.postid;
    const post = await Posts.findById(postId, "authorId");
    if (!post)
      throw new ErrorHandler("Post not found, Please verify.", 404);
    if (post.authorId.toString() !== req.user.userId)
      throw new ErrorHandler("You are not authorised");
    next();
  } catch (error) {
    next(error)
  }
};