import bcrypt from "bcrypt";
import ErrorHandler from "./Error.class.js";

export const encryptPassword = async (password: string) => {
  try {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
    throw new ErrorHandler("Unable to encrypt password");
  }
};

export const passwordMatch = async (enteredPassword: string, actualPassword: string) => {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, actualPassword);
    return isMatch;
  } catch (error) {
    console.log(error);
    throw new ErrorHandler("Unable to verify password");
  }
}