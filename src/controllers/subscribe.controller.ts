import { NextFunction, Response } from "express";
import { ICustomRequest } from "../utilities/types.js";
import Subscribers from "../models/subscribers.model.js";
import ErrorHandler from "../utilities/Error.class.js";
import { successJSON } from "../utilities/utility.js";
import Users from "../models/users.model.js";

export const subscribe = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const authorId = req.params.authorid;
    const author = await Subscribers.findOne({ authorId: authorId });
    if (!author)
      throw new ErrorHandler("Author doesn't exist");
    if (author.subscribedBy.includes(userId))
      res.status(200).json(successJSON("You are already subscribed"));
    const update = await Subscribers.findOneAndUpdate({ authorId }, { $addToSet: { subscribedBy: userId } });
    if (!update) throw new ErrorHandler("Author not found", 404);
    res.status(200).json(successJSON("Subscribed successfully"));
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
    res.status(200).json(successJSON("unsubscribed successfully"));
  } catch (error) {
    next(error);
  }
};

export const getSubscribers = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const subscribersList = await Subscribers.findOne({ authorId: userId });
    if (!subscribersList) throw new ErrorHandler("Details not found");
    const subscribedusers = await Users.find({ _id: { $in: subscribersList.subscribedBy } }).select("_id userName")
    res.status(200).json(successJSON(`Total number of subscribers is ${subscribersList.subscribedBy.length}`, {
      subscribers: subscribedusers
    }))
  } catch (error) {
    next(error)
  }
}