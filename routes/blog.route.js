import express from "express";
import { BlogController } from "../controllers/blog.controller.js";
import upload from "../middlewares/upload.middleware.js";

const BlogRouter = express.Router();

BlogRouter.post("/add", BlogController.addNewBlog);
BlogRouter.get("/all", BlogController.getAllBlog);
BlogRouter.get("/detail/:id", BlogController.getBlogById);
BlogRouter.put("/update", BlogController.updateBlog);
BlogRouter.post("/upload", upload.single('thumbnail'), BlogController.uploadImage);

export { BlogRouter };