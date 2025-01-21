import { NextFunction, Response } from "express";
import { ICustomRequest } from "../utilities/types.js";
import ErrorHandler from "../utilities/Error.class.js";
import Users from "../models/users.model.js";

export const adminVerification = async (req: ICustomRequest, _res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new ErrorHandler("Please login!", 401);
    const { userId } = req.user;
    const user = await Users.findById(userId, 'role');
    if (!user || user.role !== 'ADMIN') throw new ErrorHandler("You are not Permitted", 403);
    next();
  } catch (error) {
    next(error);
  }
}