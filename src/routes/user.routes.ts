import express from "express";
import { createNewUser, deleteUser, getAllUsers, updateUser, verifyUsername } from "../controllers/users.controller.js";
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

/**
 * Admin only routes
 */
app.get('/getall', adminVerification, getAllUsers);

export default app;