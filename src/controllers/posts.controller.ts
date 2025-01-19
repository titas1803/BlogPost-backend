import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utilities/Error.class.js";

export const createNewPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new ErrorHandler();
  } catch (error) {
    next(error)
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new ErrorHandler();
  } catch (error) {
    next(error)
  }
};

export const deleteAPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new ErrorHandler();
  } catch (error) {
    next(error)
  }
};