import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utilities/Error.class.js";
import { ICustomRequest, INewUserReq } from "../utilities/types.js";
import Users from "../models/users.model.js";
import { rename, renameSync, rmSync, rm, promises as fsPromises } from "fs";
import { successJSON } from "../utilities/utility.js";

export const createNewUser = async (req: Request<{}, {}, INewUserReq>, res: Response, next: NextFunction) => {
  try {
    const { name, userName, phone, email, gender, dob, password } = req.body;
    const photo = req.file;

    if (!name || !userName || !phone || !email || !gender || !dob || !password)
      throw new ErrorHandler("Please provide all data", 400);

    const userNameExists = await Users.findOne({ userName });
    if (userNameExists)
      throw new ErrorHandler("Username already exists", 400);

    const emailExists = await Users.findOne({ email });
    if (emailExists)
      throw new ErrorHandler("Email already exists", 400);

    const phoneExists = await Users.findOne({ phone });
    if (phoneExists)
      throw new ErrorHandler("Phone number already exists", 400);

    const newUser = new Users({
      ...req.body,
      photo: photo?.path,
      dob: new Date(dob),
    });
    newUser.password = password;
    const createdUser = await newUser.save();

    res.status(201).json(`Account created successfully with username ${createdUser.userName}`);
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

export const updateUser = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  try {
    const { name, userName, phone, email, gender, dob } = req.body;
    const photo = req.file;

    /**
     * get userId and userName from req
     */
    if (!req.user) throw new ErrorHandler("User information is missing", 400);

    const { userId } = req.user;

    const user = await Users.findById(userId);

    if (!user) throw new ErrorHandler("user not found", 404);

    const { photo: oldPhoto, userName: oldUserName } = user;

    /**
     * set photo pathname
     */
    let newPhotoPath = oldPhoto;

    if (userName && photo) {
      newPhotoPath = photo.path.replace(oldUserName, userName);
    } else if (userName) {
      newPhotoPath = oldPhoto.replace(oldUserName, userName);
    } else if (photo) {
      newPhotoPath = photo.path;
    }
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
        photo: newPhotoPath
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

    /**
     * Update the upload location name if username changes
     */
    if (userName && (userName !== oldUserName)) {
      const oldFolderPath = `uploads/${oldUserName}`
      const newFolderPath = `uploads/${userName}`
      renameSync(oldFolderPath, newFolderPath);
    }

    res.status(200).json(successJSON("Data updated successfully"));
  } catch (error) {

    /**
     * if the update failes
     * delete the photo recently added for update
     */
    console.log(error)
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
    const userDeleted = await Users.findByIdAndDelete({ _id: userId });
    if (!userDeleted) throw new ErrorHandler("User doesn't exist");
    const folderPath = `uploads/${userDeleted.userName}`;
    await fsPromises.rm(folderPath, { recursive: true });
    res.status(200).json(successJSON(`User ${userDeleted.userName} deleted successfully`));
  } catch (error) {
    console.log(error);
    next(error)
  }
};

/**
 * ADMIN only
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new ErrorHandler();
  } catch (error) {
    next(error)
  }
};

