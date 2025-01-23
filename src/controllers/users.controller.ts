import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utilities/Error.class.js";
import { ICustomRequest, INewUserReq } from "../utilities/types.js";
import Users from "../models/users.model.js";
import { rmSync, rm, promises as fsPromises } from "fs";
import { getUserById, successJSON } from "../utilities/utility.js";
import { encryptPassword } from "../utilities/encryption.js";

export const createNewUser = async (req: Request<{}, {}, INewUserReq>, res: Response, next: NextFunction) => {
  try {
    let { name, userName, phone, email, gender, dob, password } = req.body;
    const photo = req.file;

    if (!name || !userName || !phone || !email || !gender || !dob || !password)
      throw new ErrorHandler("Please provide all data", 400);

    userName = userName.toLowerCase();
    email = email.toLowerCase();

    const userExists = await Users.findOne({ userName, email, phone });
    if (userExists)
      throw new ErrorHandler("User already exists", 400);

    const newUser = new Users({
      ...req.body,
      userName,
      email,
      photo: photo?.path,
      dob: new Date(dob),
    });
    newUser.password = await encryptPassword(password);
    const createdUser = await newUser.save();

    res.status(201).json(successJSON(`Account created successfully with username ${createdUser.userName}`));
  } catch (error) {
    const photo = req.file;
    if (photo) {
      rm(photo.path, () => {
        console.log('File deleted');
      });
    }
    next(error)
  }
};

export const verifyUsername = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userNameToVerify = req.params.username.toLowerCase();
    const user = await Users.findOne({ userName: userNameToVerify });
    if (user) throw new ErrorHandler("username not available", 400);
    res.status(200).json(successJSON(`Username ${userNameToVerify} is available`, {
      available: true
    }));
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  try {
    let { name, userName, phone, email, gender, dob } = req.body;
    userName = userName.toLowerCase();
    const photo = req.file;

    /**
     * get userId and userName from req
     */
    if (!req.user) throw new ErrorHandler("User information is missing", 400);

    const { userId } = req.user;

    const user = await getUserById(userId);

    /**
     * Update the user details
     */
    const updatedUser = await Users.updateOne({ _id: user._id }, {
      $set: {
        name: name ?? user.name,
        userName: userName ?? user.userName,
        phone: phone ?? user.phone,
        email: email ?? user.email,
        gender: gender ?? user.gender,
        dob: dob ? new Date(dob) : user.dob,
        photo: photo?.path ?? user.photo,
      }
    });

    if (!updatedUser) throw new ErrorHandler("Errror occured during update", 500);

    /**
     * Delete the old photo if new photo uploaded
     */
    if (updatedUser && photo) {
      try {
        rmSync(user.photo);
        console.log('Old File deleted');
      } catch (error) {
        throw new ErrorHandler("error in deleting old file")
      }
    }

    res.status(200).json(successJSON("Data updated successfully"));
  } catch (error) {

    /**
     * if the update failes
     * delete the photo recently added for update
     */
    const photo = req.file;
    if (photo) {
      rm(photo.path, () => {
        console.log('File deleted');
      });
    }
    next(error)
  }
};

export const deleteUser = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new ErrorHandler("Please Log in", 403);
    const { userId } = req.user;
    const userDeleted = await Users.findByIdAndDelete(userId);
    if (!userDeleted) throw new ErrorHandler("User doesn't exist");
    const folderPath = `uploads/${userDeleted._id.toString()}`;
    await fsPromises.rm(folderPath, { recursive: true });
    res.status(200).json(successJSON(`User ${userDeleted.userName} deleted successfully`));
  } catch (error) {
    next(error)
  }
};

export const searchUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { keyword } = req.query;
    if (!keyword || typeof keyword !== 'string')
      throw new ErrorHandler("Please provide the keyword to search for", 400);
    const matchedUsers = await Users.find({
      $or: [
        { userName: { $regex: keyword, $options: 'i' } }, // Search in userName
        { name: { $regex: keyword, $options: 'i' } } // Search in name
      ]
    }).sort({ createdAt: -1 });
    if (matchedUsers.length === 0) throw new ErrorHandler(`No User found by name or username ${keyword}`, 404);
    res.status(200).json(successJSON(`${matchedUsers.length} Users found`, {
      numberOfusers: matchedUsers.length,
      users: matchedUsers
    }));
  } catch (error) {
    next(error)
  }
};

/**
 * ADMIN only
 */
export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const allUsers = await Users.find({}).sort({ createdAt: -1 });
    if (allUsers.length === 0) throw new ErrorHandler("No User present", 404);
    res.status(200).json(successJSON(`${allUsers.length} Users found`, {
      numberOfusers: allUsers.length,
      users: allUsers
    }));
  } catch (error) {
    next(error)
  }
};

export const deleteUserById = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new ErrorHandler("Please Log in", 403);
    const { userid } = req.params;
    const userDeleted = await Users.findByIdAndDelete(userid);
    if (!userDeleted) throw new ErrorHandler("User doesn't exist");
    const folderPath = `uploads/${userDeleted._id.toString()}`;
    await fsPromises.rm(folderPath, { recursive: true });
    res.status(200).json(successJSON(`User ${userDeleted.userName} deleted successfully`));
  } catch (error) {
    next(error)
  }
};