import express from "express";
import { addComment, deleteComment, getAllCommentsOfAPost, likeAComment, unLikeAComment, updateComment } from "../controllers/comments.controller.js";
import { authenticateToken } from "../middlewares/userAuthentication.js";

const app = express.Router();

app.use(authenticateToken);

app.post("/add", addComment);
app.post("/seeAllComments", getAllCommentsOfAPost);


app.route("/:id").delete(deleteComment).patch(updateComment);
app.put("/:id/like", likeAComment);
app.put("/:id/unlike", unLikeAComment);

export default app;