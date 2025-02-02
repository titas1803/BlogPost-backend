import express from 'express';
import { authenticateToken } from '../middlewares/userAuthentication.js';
import {
  createNewPost,
  deleteAPost,
  getAllPostsByUser,
  getAPost,
  likeAPost,
  searchPost,
  unLikeApost,
  updatePost,
} from '../controllers/posts.controller.js';
import { multiUpload } from '../middlewares/multer.js';
import { sameUsersPostVerification } from '../middlewares/sameUser.js';

const app = express.Router();

/**
 * /api/v1/post
 */

app.get('/search', searchPost);

app.use(authenticateToken);

app.post('/create', multiUpload, createNewPost);
app.put('/like/:postid', likeAPost);
app.put('/unlike/:postid', unLikeApost);
app.get('/getallposts', getAllPostsByUser);
app.get('/getallposts/:authorid', getAllPostsByUser);

app
  .route('/:postid')
  .get(getAPost)
  .delete(sameUsersPostVerification, deleteAPost)
  .patch(multiUpload, updatePost);

export default app;
