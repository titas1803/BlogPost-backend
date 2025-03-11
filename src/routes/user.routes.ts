import express from 'express';
import {
  createNewUser,
  deleteUser,
  getAllUsers,
  searchUser,
  updateUser,
  verifyUsername,
  deleteUserById,
  updateProfilePhoto,
  removeProfilePhoto,
  getUserPhoto,
  getUserDetails,
  topSubscribedUSers,
  updateBio,
} from '../controllers/users.controller.js';
import { authenticateToken } from '../middlewares/userAuthentication.js';
import { singleUpload } from '../middlewares/multer.js';
import { adminVerification } from '../middlewares/adminOnly.js';

const app = express.Router();

/**
 * /api/v1/user
 */

app.post('/createUser', createNewUser);
app.get('/username-available/:username', verifyUsername);

/**
 * Logged in users only
 */
app.use(authenticateToken);
app.patch('/update', updateUser);
app.patch('/update/update-bio', updateBio);
app.patch('/update/update-photo', singleUpload, updateProfilePhoto);
app.patch('/update/remove-photo', removeProfilePhoto);
app.get('/photo', getUserPhoto);
app.delete('/delete', deleteUser);
app.get('/search', searchUser);
app.get('/getuser', getUserDetails);
app.get('/getuser/:userid', getUserDetails);
app.get('/top-users', topSubscribedUSers);

/**
 * Admin only routes
 */
app.use(adminVerification);
app.get('/getall', getAllUsers);
app.delete('/delete-user/:userid', deleteUserById);

export default app;
