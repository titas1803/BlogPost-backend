import express from "express";
import { addComment, deleteComment, getAllCommentsOfAPost, likeAComment, unLikeAComment, updateComment } from "../controllers/comments.controller.js";
import { authenticateToken } from "../middlewares/userAuthentication.js";

const app = express.Router();

/**
 * /api/v1/comment
 */

app.use(authenticateToken);

app.post("/add/:postid", addComment);
app.get("/seeAllComments/:postid", getAllCommentsOfAPost);


app.route("/:commentid").delete(deleteComment).patch(updateComment);
app.put("/:commentid/like", likeAComment);
app.put("/:commentid/unlike", unLikeAComment);

export default app;