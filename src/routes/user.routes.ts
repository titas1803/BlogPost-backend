import express from "express";
import { createNewUser, deleteUser, getAllUsers, searchUser, updateUser, verifyUsername, deleteUserById } from "../controllers/users.controller.js";
import { authenticateToken } from "../middlewares/userAuthentication.js";
import { singleUpload } from "../middlewares/multer.js";
import { adminVerification } from "../middlewares/adminOnly.js";

const app = express.Router();

app.post('/createUser', singleUpload, createNewUser);
app.get('/username-available/:username', verifyUsername);


/**
 * Logged in users only
 */
app.use(authenticateToken);
app.patch('/update', singleUpload, updateUser);
app.delete('/delete', deleteUser);
app.get('/search', searchUser);

/**
 * Admin only routes
 */
app.use(adminVerification);
app.get('/getall', getAllUsers);
app.delete('/delete-user/:userid', deleteUserById);


export default app;