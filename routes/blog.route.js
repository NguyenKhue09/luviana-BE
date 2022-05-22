import express from "express";
import { BlogController } from "../controllers/blog.controller.js";
import upload from "../middlewares/upload.middleware.js";

const BlogRouter = express.Router();

BlogRouter.post("/", BlogController.addNewBlog);
BlogRouter.get("/all", BlogController.getAllBlog);
BlogRouter.get("/detail/:blogId", BlogController.getBlogById);
BlogRouter.put("/update", BlogController.updateBlog);
BlogRouter.post("/upload", upload.single('thumbnail'), BlogController.uploadImage);
BlogRouter.get("/author/:author", BlogController.getBlogByAuthor)
BlogRouter.route("/comment") 
    .get(BlogController.getCommentList)
    .post(BlogController.addComment)
BlogRouter.get("/like/:blogId", BlogController.getLikeNumber)
BlogRouter.route("/like")
    .get(BlogController.getLikedBlogsByUser)
    .post(BlogController.likeBlog)
    .delete(BlogController.unlikeBlog)

export { BlogRouter };