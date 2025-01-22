import express from "express";
import { authenticateToken } from "../middlewares/userAuthentication.js";

const app = express.Router();

app.use(authenticateToken);

app.put("/subscribe/:authorid");
app.put("/unsubscribe/:authorid");

export default app;