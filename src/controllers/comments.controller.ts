import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utilities/Error.class.js";
import { successJSON } from "../utilities/utility.js";
import { ICustomRequest } from "../utilities/types.js";

export const addComment = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  try {
    res.status(201).json(successJSON('Comment added successfully'))
  } catch (error) {
    next(error)
  }
};

export const updateComment = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  try {
    throw new ErrorHandler();
  } catch (error) {
    next(error)
  }
};

export const deleteComment = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  try {
    throw new ErrorHandler();
  } catch (error) {
    next(error)
  }
};

export const likeAComment = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  try {
    throw new ErrorHandler();
  } catch (error) {
    next(error)
  }
};

export const unLikeAComment = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  try {
    throw new ErrorHandler();
  } catch (error) {
    next(error)
  }
};

export const getAllCommentsOfAPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new ErrorHandler();
  } catch (error) {
    next(error)
  }
};
