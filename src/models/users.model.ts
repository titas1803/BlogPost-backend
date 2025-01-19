import mongoose, { CallbackError, ObjectId } from "mongoose";
import validator from "validator";
import { IUser } from "../utilities/types.js";
import Login from "./login.model.js";
import ErrorHandler from "../utilities/Error.class.js";

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    trim: true,
    unique: [true, "Email already exists"],
    lowercase: true,
    validate: validator.default.isEmail
  },
  phone: {
    type: String,
    required: [true, "Please enter your phone number"],
    trim: true,
    unique: [true, "Phone number already exists"],
    lowercase: true,
    validate: validator.default.isMobilePhone
  },
  photo: {
    type: String,
    required: [true, 'Please add photo'],
  },
  role: {
    type: String,
    enum: ['ADMIN', 'USER'],
    default: 'USER',
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'Please enter your gender'],
  },
  dob: {
    type: Date,
    required: [true, 'Please enter date'],
  },
  userName: {
    type: String,
    required: [true, "Choose a unique username"],
    unique: [true, "Username already exists"],
  },
}, {
  timestamps: true
});

userSchema.post('save', async function (doc, next) {
  try {
    const user = this as mongoose.Document & { password?: string };

    if (!user.password) {
      throw new ErrorHandler("Password is required for creating login data.");
    }

    const loginDetails = new Login({ userId: doc._id, password: user.password ?? 'Demo@123' });
    await loginDetails.save();
  } catch (error) {
    console.log(error);
    // If loginDetails creation fails, delete the user document
    await this.model('Users').deleteOne({ _id: doc._id });
    throw new ErrorHandler("Internal error");
  }
});

userSchema.pre('findOneAndDelete', async function (next) {
  try {
    console.log(this.getQuery()._id)
    const deletedLogin = await Login.deleteOne({ userId: this.getQuery()._id });
    if (!deletedLogin) throw new ErrorHandler("Unable to delete user");
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

const Users = mongoose.model<IUser>("Users", userSchema);

Users.init().then(() => {
  console.log("Users index created successfully")
}).catch((err) => {
  console.log("Error Occured", err)
});

export default Users;


