import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../utilities/Error.class.js';
import { ICustomRequest, INewUserReq } from '../utilities/types.js';
import Users from '../models/users.model.js';
import { rmSync, rm, promises as fsPromises } from 'fs';
import { getUserById, successJSON } from '../utilities/utility.js';
import { encryptPassword } from '../utilities/encryption.js';

export const verifyUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userNameToVerify = req.params.username.toLowerCase();
    const user = await Users.findOne({ userName: userNameToVerify });
    if (user) throw new ErrorHandler('username not available', 400);
    res.status(200).json(
      successJSON(`Username ${userNameToVerify} is available`, {
        available: true,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const createNewUser = async (
  req: Request<{}, {}, INewUserReq>,
  res: Response,
  next: NextFunction
) => {
  try {
    let { name, userName, phone, email, gender, dob, password } = req.body;

    console.log(req.body, name, userName, phone, email, gender, dob, password);
    if (!name || !userName || !phone || !email || !gender || !dob || !password)
      throw new ErrorHandler('Please provide all data', 400);

    userName = userName.toLowerCase();
    email = email.toLowerCase();

    const userExists = await Users.findOne({ userName, email, phone });
    if (userExists) throw new ErrorHandler('User already exists', 400);

    const newUser = new Users({
      ...req.body,
      userName,
      email,
      photo: '',
      dob: new Date(dob),
    });
    newUser.password = await encryptPassword(password);
    const createdUser = await newUser.save();

    res.status(201).json(
      successJSON(
        `Account created successfully with username ${createdUser.userName}`,
        {
          username: createdUser.userName,
          userid: createdUser._id,
        }
      )
    );
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let { name, userName, phone, email, gender, dob } = req.body;
    userName = userName.toLowerCase();

    /**
     * get userId and userName from req
     */
    if (!req.user) throw new ErrorHandler('User information is missing', 400);

    const { userId } = req.user;

    const user = await getUserById(userId);

    /**
     * Update the user details
     */
    const updatedUser = await Users.findOneAndUpdate(
      {
        _id: user.id,
      },
      {
        $set: {
          name: name ?? user.name,
          userName: userName ?? user.userName,
          phone: phone ?? user.phone,
          email: email ?? user.email,
          gender: gender ?? user.gender,
          dob: dob ? new Date(dob) : user.dob,
        },
      }
    )
      .populate([
        {
          path: 'noOfSubscribers',
          select: 'subscribedBy',
        },
        { path: 'noOfSubscribedTo', select: 'subscribedTo' },
      ])
      .lean();
    if (!updatedUser)
      throw new ErrorHandler('Errror occured during update', 500);
    res.status(200).json(
      successJSON('Data updated successfully', {
        user: updatedUser,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const updateProfilePhoto = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ErrorHandler('Please Login!', 401);
    if (!req.file) throw new ErrorHandler('Please add a photo!', 400);
    const { userId } = req.user;
    const { path: photo } = req.file;
    const user = await Users.findById(userId);
    if (!user) throw new ErrorHandler('user not found', 404);
    const updatedUser = await Users.findOneAndUpdate(
      { _id: user.id },
      {
        $set: {
          photo,
        },
      }
    );
    if (!updatedUser)
      throw new ErrorHandler('Not able to update the photo', 400);
    rmSync(user.photo, { recursive: true });
    res
      .status(200)
      .json(successJSON('Profile photo updated successfully', { photo }));
  } catch (error) {
    next(error);
  }
};

export const removeProfilePhoto = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ErrorHandler('Please Login!', 401);
    const { userId } = req.user;
    const user = await Users.findById(userId);
    if (!user) throw new ErrorHandler('User not found', 404);
    const currentPhoto = user.photo;
    const updatedUser = await Users.findByIdAndUpdate(userId, {
      $set: {
        photo: '',
      },
    });
    if (!updatedUser)
      throw new ErrorHandler('Not able to remove the photo', 400);
    if (currentPhoto) {
      rmSync(currentPhoto);
    }
    res.status(200).json(successJSON('Profile photo remvoed successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ErrorHandler('Please Log in', 403);
    const { userId } = req.user;
    const userDeleted = await Users.findByIdAndDelete(userId);
    if (!userDeleted) throw new ErrorHandler("User doesn't exist");
    const folderPath = `uploads/${userDeleted._id.toString()}`;
    await fsPromises.rm(folderPath, { recursive: true });
    res
      .status(200)
      .json(successJSON(`User ${userDeleted.userName} deleted successfully`));
  } catch (error) {
    next(error);
  }
};

export const searchUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { keyword } = req.query;
    if (!keyword || typeof keyword !== 'string')
      throw new ErrorHandler('Please provide the keyword to search for', 400);
    const matchedUsers = await Users.find({
      $or: [
        { userName: { $regex: keyword, $options: 'i' } }, // Search in userName
        { name: { $regex: keyword, $options: 'i' } }, // Search in name
      ],
    }).sort({ createdAt: -1 });
    if (matchedUsers.length === 0)
      throw new ErrorHandler(
        `No User found by name or username ${keyword}`,
        404
      );
    res.status(200).json(
      successJSON(`${matchedUsers.length} Users found`, {
        numberOfusers: matchedUsers.length,
        users: matchedUsers,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getUserDetails = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user!;
    const paramUserId = req.params.userid;
    if (!userId) throw new ErrorHandler('Please log in!', 401);
    const userDetails = await Users.findById(paramUserId ?? userId)
      .populate([
        {
          path: 'noOfSubscribers',
          select: 'subscribedBy',
        },
        { path: 'noOfSubscribedTo', select: 'subscribedTo' },
      ])
      .lean();
    if (!userDetails) throw new ErrorHandler('User not found.', 404);
    const updatedUserDetails = {
      id: userDetails._id,
      name: userDetails.name,
      userName: userDetails.userName,
      email: userDetails.email,
      photo: userDetails.photo,
      phone: userDetails.phone,
      gender: userDetails.gender,
      dob: userDetails.dob,
      noOfSubscribers: userDetails.noOfSubscribers?.subscribedBy?.length ?? 0,
      noOfSubscriberedTo:
        userDetails.noOfSubscribedTo?.subscribedTo?.length ?? 0,
    };
    res.status(200).json(
      successJSON('useer details found', {
        user: updatedUserDetails,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getUserPhoto = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user!;
    if (!userId) throw new ErrorHandler('Please Login!', 401);
    const user = await getUserById(userId);
    if (!user) throw new ErrorHandler('Please Login!', 401);

    res.status(200).json(
      successJSON('Photo fetched successfully', {
        photo: user.photo,
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * ADMIN only
 */
export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allUsers = await Users.find({}).sort({ createdAt: -1 });
    if (allUsers.length === 0) throw new ErrorHandler('No User present', 404);
    res.status(200).json(
      successJSON(`${allUsers.length} Users found`, {
        numberOfusers: allUsers.length,
        users: allUsers,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ErrorHandler('Please Log in', 403);
    const { userid } = req.params;
    const userDeleted = await Users.findByIdAndDelete(userid);
    if (!userDeleted) throw new ErrorHandler("User doesn't exist");
    const folderPath = `uploads/${userDeleted._id.toString()}`;
    await fsPromises.rm(folderPath, { recursive: true });
    res
      .status(200)
      .json(successJSON(`User ${userDeleted.userName} deleted successfully`));
  } catch (error) {
    next(error);
  }
};
