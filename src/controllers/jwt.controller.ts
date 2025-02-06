import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../utilities/Error.class.js';
import jwt from 'jsonwebtoken';
import { successJSON } from '../utilities/utility.js';

const secretKey = process.env.BLOGPOST_BACKEND_JWTSECRTKEY!;

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new ErrorHandler(`Authorization header is missing`, 401);
    }
    const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
    if (!token) {
      throw new ErrorHandler('Please login', 401);
    }

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        console.log(token, authHeader);
        throw new ErrorHandler('Invalid or expired token', 401);
      }

      const decodedUser = user as jwt.JwtPayload; // Type assertion for user payload
      if (!decodedUser._id) {
        throw new ErrorHandler('User ID not found in token', 401);
      }

      res.status(200).json(
        successJSON('auth token verified', {
          userid: decodedUser._id,
        })
      );
    });
  } catch (error) {
    next(error);
  }
};
