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
BlogRouter.post("/comment", BlogController.addComment)
BlogRouter.get("/comment/:blogId", BlogController.getCommentList)

export { BlogRouter };