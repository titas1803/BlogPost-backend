import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utilities/Error.class.js";

export const errorMiddleWare = (err: ErrorHandler, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.statusCode).json(
    {
      status: false,
      message: err.message
    }
  );
}