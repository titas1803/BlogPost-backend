import express from "express";
import { createNewUser, deleteUser, getAllUsers, updateUser } from "../controllers/users.controller.js";
import { authenticateToken } from "../middlewares/userAuthentication.js";
import { singleUplaod } from "../middlewares/multer.js";

const app = express.Router();

app.post('/createUser', singleUplaod, createNewUser);

app.use(authenticateToken);

app.patch('/update', singleUplaod, updateUser);
app.delete('/delete', deleteUser);
app.get('/getAll', getAllUsers);

export default app;