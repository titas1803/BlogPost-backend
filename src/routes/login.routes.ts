import express from "express";
import { loginUser } from "../controllers/login.controller.js";

const app = express.Router();
app.post('/', (req, res, next) => {
  next();
}, loginUser);

export default app;