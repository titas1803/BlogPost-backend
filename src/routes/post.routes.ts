import express from "express";
import { authenticateToken } from "../middlewares/userAuthentication.js";
import { createNewPost, deleteAPost, likeAPost, searchPost, unLikeApost, updatePost } from "../controllers/posts.controller.js";
import { multiUpload } from "../middlewares/multer.js";
import { sameUsersPostVerification } from "../middlewares/sameUser.js";

const app = express.Router();

app.get('/search', searchPost);
app.use(authenticateToken);
app.post('/create', multiUpload, createNewPost);
app.put("/like/:postid", likeAPost);
app.put("/unlike/:postid", unLikeApost);

app.use(sameUsersPostVerification);
app.delete('/:postid', deleteAPost);

app.use(multiUpload);
app.patch("/:postid", updatePost);


export default app;