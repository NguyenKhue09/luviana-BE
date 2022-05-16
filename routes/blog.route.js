import express from "express";
import { BlogController } from "../controllers/blog.controller.js";

const BlogRouter = express.Router();

BlogRouter.post("/add", BlogController.addNewBlog);
BlogRouter.get("/all", BlogController.getAllBlog);
BlogRouter.get("/detail/:id", BlogController.getBlogById);
BlogRouter.put("/update", BlogController.updateBlog);

export { BlogRouter };