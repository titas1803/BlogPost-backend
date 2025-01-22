import { NextFunction, Response } from "express";
import { ICustomRequest } from "../utilities/types.js";
import Subscribers from "../models/subscribers.model.js";
import ErrorHandler from "../utilities/Error.class.js";

export const subscribe = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const authorId = req.params.authorid;
    const update = await Subscribers.findOneAndUpdate({ authorId }, { $addToSet: { subscribedBy: userId } });
    if (!update) throw new ErrorHandler("Author not found", 404);
    res.status(200).json("Subscribed successfully");
  } catch (error) {
    next(error);
  }
};

export const unSubscribe = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const authorId = req.params.authorid;
    const update = await Subscribers.findOneAndUpdate({ authorId }, { $pull: { subscribedBy: userId } });
    if (!update) throw new ErrorHandler("Author not found", 404);
    res.status(200).json("unsubscribed successfully");
  } catch (error) {
    next(error);
  }
};