import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../utilities/Error.class.js';
import { ICustomRequest, IPopulatedPost } from '../utilities/types.js';
import Users from '../models/users.model.js';
import Posts from '../models/posts.model.js';
import { successJSON } from '../utilities/utility.js';
import { rmSync } from 'fs';
import {
  emitDeletePost,
  emitDeletePostInProfile,
  emitNewPost,
  emitUpdatePost,
  emitUpdatePostInProfile,
} from '../utilities/socket.js';

export const createNewPost = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ErrorHandler('Please login', 401);
    const authorId = req.user.userId;
    const { title, content, tags, categories, isPublished } = req.body;
    let imagePath: string[] = [];
    if (req.files && Array.isArray(req.files))
      imagePath = req.files.map((image) => image.path);
    if (!title || !content)
      throw new ErrorHandler('Please provide the required details', 400);

    const user = await Users.findById(authorId);
    if (!user) throw new ErrorHandler('Please login', 401);

    const newPost = await new Posts({
      ...req.body,
      image: [...imagePath],
      authorId,
      tags: tags?.split(' ') ?? '',
      categories: categories?.split(',') ?? '',
      likedBy: [],
      isPublished,
    }).save();

    const populatedPost = await Posts.findById(newPost._id)
      .populate([
        'commentsCount',
        {
          path: 'authorDetails',
          select: ['name', 'userName'],
        },
      ])
      .lean();

    if (populatedPost) {
      emitNewPost(authorId, populatedPost as IPopulatedPost);
    } else {
      throw new ErrorHandler('Error populating post', 500);
    }
    res.status(201).json(successJSON('Post created suuccessfully'));
  } catch (error) {
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((image) => {
        rmSync(image.path, { recursive: true });
      });
    }
    next(error);
  }
};

export const updatePost = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = req.params.postid;
    if (!postId)
      throw new ErrorHandler('Please provide which post to update', 400);

    if (!req.user) throw new ErrorHandler('Please Login', 401);

    const post = await Posts.findById(postId);
    if (!post) throw new ErrorHandler('Post not found', 404);

    const { title, content, tags, categories, isPublished } = req.body;
    let imagePath;
    if (req.files && Array.isArray(req.files))
      imagePath = req.files.map((image) => image.path);

    const updatedPost = await Posts.findByIdAndUpdate(postId, {
      $set: {
        title: title ?? post.title,
        content: content ?? post.content,
        tags: tags ? tags.split(' ') : post.tags,
        categories: categories ? categories.split(',') : post.categories,
        isPublished: isPublished ?? post.isPublished,
        images: imagePath ?? post.images,
      },
    });

    const latestPost = await Posts.findByIdAndUpdate(postId)
      .populate([
        'commentsCount',
        {
          path: 'authorDetails',
          select: ['name', 'userName'],
        },
      ])
      .lean();
    if (!updatedPost) throw new ErrorHandler('Error Occured', 500);
    if (!latestPost) throw new ErrorHandler('Error Occured', 500);

    console.log('ispublished', updatedPost.isPublished, latestPost.isPublished);
    emitUpdatePostInProfile(req.user.userId, latestPost as IPopulatedPost);
    emitUpdatePost(postId, latestPost as IPopulatedPost);
    res.status(200).json(successJSON('Post updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteAPost = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = req.params.postid;
    const deletedPost = await Posts.findOneAndDelete({
      _id: postId,
      authorId: req.user?.userId,
    });
    if (!deletedPost)
      throw new ErrorHandler(
        'Post not found or you are not authorized to delete the post',
        404
      );
    if (req.user?.userId) {
      emitDeletePostInProfile(req.user.userId, deletedPost.id);
    }
    emitDeletePost(deletedPost.id);
    res.status(200).json(successJSON(`'${deletedPost.title}' is deleted`));
  } catch (error) {
    next(error);
  }
};

export const getAPost = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const postid = req.params.postid;
    const post = await Posts.findById(postid)
      .populate([
        'commentsCount',
        {
          path: 'authorDetails',
          select: ['name', 'userName'],
        },
      ])
      .lean();
    if (!post) throw new ErrorHandler("post isn't available anymore", 404);
    res.status(200).json(
      successJSON('1 post found', {
        post,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const likeAPost = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const postid = req.params.postid;
    const likedPost = await Posts.findByIdAndUpdate(postid, {
      $addToSet: { likedBy: req.user?.userId },
    });
    if (!likedPost) throw new ErrorHandler('post might not be available', 404);

    const updatedPost = await Posts.findById(likedPost.id)
      .populate([
        'commentsCount',
        {
          path: 'authorDetails',
          select: ['name', 'userName'],
        },
      ])
      .lean();
    emitUpdatePostInProfile(
      likedPost.authorId.toString(),
      updatedPost as IPopulatedPost
    );
    emitUpdatePost(likedPost.id.toString(), updatedPost as IPopulatedPost);
    res.status(200).json(successJSON('post liked successfuly'));
  } catch (error) {
    next(error);
  }
};

export const unLikeApost = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const postid = req.params.postid;
    const unLikedPost = await Posts.findByIdAndUpdate(postid, {
      $pull: { likedBy: req.user?.userId },
    });
    if (!unLikedPost)
      throw new ErrorHandler('post might not be available', 404);
    const updatedPost = await Posts.findById(unLikedPost.id)
      .populate([
        'commentsCount',
        {
          path: 'authorDetails',
          select: ['name', 'userName'],
        },
      ])
      .lean();
    emitUpdatePostInProfile(
      unLikedPost.authorId.toString(),
      updatedPost as IPopulatedPost
    );
    emitUpdatePost(unLikedPost.id.toString(), updatedPost as IPopulatedPost);
    res.status(200).json(successJSON('post unlikedliked successfuly'));
  } catch (error) {
    next(error);
  }
};

export const searchPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const keyword = req.query.keyword as string;
    if (!keyword || typeof keyword !== 'string' || keyword.length < 3)
      throw new ErrorHandler(
        'Please provide a key atleast 3 character long',
        400
      );
    const matchedPosts = await Posts.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } },
        { tags: { $regex: keyword, $options: 'i' } },
        { categories: { $regex: keyword, $options: 'i' } },
      ],
    })
      .sort({
        createdAt: -1,
      })
      .populate([
        'commentsCount',
        {
          path: 'authorDetails',
          select: ['name', 'userName'],
        },
      ])
      .lean();
    if (!matchedPosts) throw new ErrorHandler();
    if (matchedPosts.length === 0)
      throw new ErrorHandler(`No Post found by ${keyword}`, 404);
    res.status(200).json(
      successJSON(`${matchedPosts.length} posts found`, {
        matched: matchedPosts.length,
        posts: matchedPosts,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getAllPostsByUser = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorid = req.params.authorid;
    const { userId } = req.user!;

    const authorOfPosts = authorid ?? userId;

    const posts = await Posts.find({
      authorId: authorOfPosts,
      ...(authorOfPosts !== userId && { isPublished: 'true' }),
    })
      .sort({
        createdAt: -1,
      })
      .populate([
        'commentsCount',
        {
          path: 'authorDetails',
          select: ['name', 'userName'],
        },
      ])
      .lean();

    if (!posts.length) throw new ErrorHandler('No Post found by the user', 404);
    res.status(200).json(
      successJSON(`${posts.length} posts found`, {
        noOfPosts: posts.length,
        posts,
      })
    );
  } catch (error) {
    next(error);
  }
};
