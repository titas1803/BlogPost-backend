import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utilities/Error.class.js";
import { ICustomRequest } from "../utilities/types.js";
import Users from "../models/users.model.js";
import Posts from "../models/posts.model.js";
import { successJSON } from "../utilities/utility.js";
import { rmSync } from "fs";

export const createNewPost = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new ErrorHandler("Please login", 401);
    const authorId = req.user.userId;
    const { title, content, tags, categories, isPublished } = req.body;
    let imagePath: string[] = [];
    if (req.files && Array.isArray(req.files))
      imagePath = req.files.map((image) => image.path);
    if (!title || !content)
      throw new ErrorHandler("Please provide the required details", 400);

    const user = await Users.findById(authorId);
    if (!user) throw new ErrorHandler("Please login", 401);

    await new Posts({
      ...req.body,
      image: [...imagePath],
      authorId,
      tags: tags.split(" "),
      categories: categories.split(","),
      likedBy: [],
      isPublished
    }).save();

    res.status(201).json(successJSON('Post created suuccessfully'));
  } catch (error) {
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((image) => {
        rmSync(image.path, { recursive: true });
      })
    }
    next(error)
  }
};

export const updatePost = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postid;
    if (!postId)
      throw new ErrorHandler("Please provide which post to update", 400);

    if (!req.user)
      throw new ErrorHandler("Please Login", 401);

    const post = await Posts.findById(postId);
    if (!post)
      throw new ErrorHandler("Post not found", 404);

    const { title, content, tags, categories, isPublished } = req.body;
    let imagePath;
    if (req.files && Array.isArray(req.files))
      imagePath = req.files.map((image) => image.path);

    const updatedPost = await Posts.findByIdAndUpdate(postId, {
      $set: {
        title: title ?? post.title,
        content: content ?? post.content,
        tags: tags ? tags.split(" ") : post.tags,
        categories: categories ? categories.split(",") : post.categories,
        isPublished: isPublished ?? post.isPublished,
        images: imagePath ?? post.images
      }
    });

    if (!updatedPost) throw new ErrorHandler("Error Occured", 500);
    res.status(200).json(successJSON("Post updated successfully"));
  } catch (error) {
    next(error)
  }
};

export const deleteAPost = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postid;
    const deletedPost = await Posts.findOneAndDelete({ _id: postId, authorId: req.user?.userId });
    if (!deletedPost)
      throw new ErrorHandler("Post not found or you are not authorized to delete the post", 404);
    res.status(200).json(successJSON(`'${deletedPost.title}' is deleted`));
  } catch (error) {
    next(error)
  }
};

export const likeAPost = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  try {
    const postid = req.params.postid;
    const post = await Posts.findById(postid);
    if (!post)
      throw new ErrorHandler("post might not be available", 404);
    const likedPost = await post.updateOne({ $addToSet: { likedBy: req.user?.userId } });
    if (!likedPost.acknowledged) throw new ErrorHandler();
    res.status(200).json(successJSON("post liked successfuly"));
  } catch (error) {
    next(error)
  }
};

export const unLikeApost = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  try {
    const postid = req.params.postid;
    const post = await Posts.findById(postid);
    if (!post)
      throw new ErrorHandler("post might not be available", 404);
    const unLikedPost = await post.updateOne({ $pull: { likedBy: req.user?.userId } });
    if (!unLikedPost.acknowledged) throw new ErrorHandler();
    res.status(200).json(successJSON("post unlikedliked successfuly"));
  } catch (error) {
    next(error)
  }
};