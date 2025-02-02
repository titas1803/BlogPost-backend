import express from "express";
import { loginUser } from "../controllers/login.controller.js";

const app = express.Router();
/**
 * /api/v1/login
 */

app.post('/', loginUser);

export default app;