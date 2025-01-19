import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utilities/Error.class.js";
import jwt from "jsonwebtoken";
import Users from "../models/users.model.js";
import Login from "../models/login.model.js";
import { ILoginReq } from "../utilities/types.js";

const secretKey = process.env.JWTSECRTKEY!;

export const loginUser = async (req: Request<{}, {}, ILoginReq>, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) throw new ErrorHandler("Please provide login details", 400);

    const user = await Users.findOne({ userName: username });

    if (!user)
      throw new ErrorHandler("User not found1", 404);

    const loginDetails = await Login.findOne({ userId: user._id });

    if (!loginDetails)
      throw new ErrorHandler("User not found2", 404);
    if (loginDetails.password !== password)
      throw new ErrorHandler("Password doesn't match", 404);

    jwt.sign({ _id: user._id, userName: user.userName }, secretKey, { expiresIn: '1h' }, (err: Error | null, token: string | undefined) => {
      if (err)
        throw new ErrorHandler("cannot create token");
      res.json({ accessToken: token });
    }); // Token expires in 1 hour

  } catch (error) {
    next(error)
  }
};