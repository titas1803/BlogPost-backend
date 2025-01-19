import mongoose from "mongoose";
import validator from "validator";
import { ILogin } from "../utilities/types.js";

const loginSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  password: {
    type: String,
    required: true,
    validate: validator.isStrongPassword
  }
}, {
  timestamps: true
});

const Login = mongoose.model<ILogin>("login", loginSchema);

export default Login;