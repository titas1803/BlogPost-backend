import express from "express";
import { authenticateToken } from "../middlewares/userAuthentication.js";
import { getSubscribers, subscribe, unSubscribe } from "../controllers/subscribe.controller.js";

const app = express.Router();

app.use(authenticateToken);

app.put("/subscribe/:authorid", subscribe);
app.put("/unsubscribe/:authorid", unSubscribe);

app.get("/getSubscribers", getSubscribers);

export default app;