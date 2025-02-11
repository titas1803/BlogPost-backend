import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../utilities/Error.class.js';
import { successJSON } from '../utilities/utility.js';
import { ICustomRequest } from '../utilities/types.js';
import Posts from '../models/posts.model.js';
import Comments from '../models/comments.model.js';

export const addComment = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentText } = req.body;
    const authorId = req.user?.userId;
    const postId = req.params.postid;
    if (!commentText) throw new ErrorHandler('Please add a comment', 400);
    if (!authorId) throw new ErrorHandler('Please login!', 401);
    if (!postId) throw new ErrorHandler('Post not found', 404);
    const post = await Posts.findById(postId);
    if (!post) throw new ErrorHandler('Post not found', 404);
    const comment = new Comments({
      postId,
      authorId,
      commentText,
    }).save();
    if (!comment) throw new ErrorHandler();
    res.status(201).json(successJSON('Comment added successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = req.params.commentid;
    if (!req.user) throw new ErrorHandler('Please login!', 401);
    const loggedinUserId = req.user.userId;
    const { commentText } = req.body;
    const updatedComment = await Comments.findOneAndUpdate(
      { _id: commentId, authorId: loggedinUserId },
      {
        $set: {
          commentText,
        },
      }
    );
    if (!updatedComment)
      throw new ErrorHandler(
        'Comment not found or you are not authorized to update the comment'
      );
    res.status(200).json(successJSON('Comment updated'));
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = req.params.commentid;
    const userId = req.user?.userId;
    if (!userId) throw new ErrorHandler('Please login!', 401);
    const comment = await Comments.findById(commentId);
    if (!comment) throw new ErrorHandler('Comment not found', 404);

    const post = await Posts.findById(comment.postId, 'authorId');
    if (!post) throw new ErrorHandler('post not found', 404);

    if (
      userId === comment.authorId.toString() ||
      userId === post.authorId.toString()
    ) {
      const deletedComment = await comment.deleteOne();
      if (!deletedComment.acknowledged) throw new ErrorHandler();
      res.status(200).json(successJSON('Comment is deleted'));
    } else
      throw new ErrorHandler(
        'You are not authorized to delete this comment',
        403
      );
  } catch (error) {
    next(error);
  }
};

export const likeAComment = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = req.params.commentid;
    const userId = req.user?.userId;
    if (!userId) throw new ErrorHandler('Please login!', 401);
    const comment = await Comments.findById(commentId);
    if (!comment) throw new ErrorHandler('Comment not found');
    const likedComment = await comment.updateOne({
      $addToSet: { likedBy: userId },
    });
    if (!likedComment.acknowledged) throw new ErrorHandler();
    res.status(200).json(successJSON('Comment liked'));
  } catch (error) {
    next(error);
  }
};

export const unLikeAComment = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = req.params.commentid;
    const userId = req.user?.userId;
    if (!userId) throw new ErrorHandler('Please login!', 401);
    const comment = await Comments.findById(commentId);
    if (!comment) throw new ErrorHandler('Comment not found');
    const unlikedComment = await comment.updateOne({
      $pull: { likedBy: userId },
    });
    if (!unlikedComment.acknowledged) throw new ErrorHandler();
    res.status(200).json(successJSON('Like removed from the comment'));
  } catch (error) {
    next(error);
  }
};

export const getAllCommentsOfAPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = req.params.postid;
    const comments = await Comments.find({ postId })
      .sort({ createdAt: 1 })
      .populate([
        {
          path: 'authorDetails',
          select: ['name', 'userName'],
        },
      ])
      .lean();
    res.status(200).json(
      successJSON(`${comments.length} comments found`, {
        comments,
      })
    );
  } catch (error) {
    next(error);
  }
};
