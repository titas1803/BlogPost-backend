import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utilities/Error.class.js";
import { ICustomRequest } from "../utilities/types.js";

const secretKey = process.env.JWTSECRTKEY!;

// Middleware to verify JWT token
export const authenticateToken = async (req: ICustomRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      throw new ErrorHandler("Authorization header is missing", 401);
    }

    const token = authHeader.split(" ")[1]; // Extract token from 'Bearer <token>'
    if (!token) {
      throw new ErrorHandler("Please login", 401);
    }

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        throw new ErrorHandler("Invalid or expired token", 401);
      }

      const decodedUser = user as jwt.JwtPayload; // Type assertion for user payload
      if (!decodedUser._id) {
        throw new ErrorHandler("User ID not found in token", 401);
      }

      // Attach user ID to the request body for further use
      req.user = {
        userId: (decodedUser._id as string),
        userName: (decodedUser.userName as string)
      }
      next();
    });
  } catch (err) {
    next(err); // Pass error to the global error handler
  }
};
