import express from "express";
import { loginUser } from "../controllers/login.controller.js";

const app = express.Router();
app.post('/', loginUser);

export default app;