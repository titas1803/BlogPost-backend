import Users from "../models/users.model.js";
import ErrorHandler from "./Error.class.js";

export const successJSON = (message: string, content?: Object) => {
  return {
    success: true,
    message,
    ...content
  };
};

export const getUserById = async (userId: string) => {
  const user = await Users.findById(userId);
  if (!user) throw new ErrorHandler("User not found", 404);
  return user;
}