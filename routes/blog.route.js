import express from "express";
import { BlogController } from "../controllers/blog.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { AuthMiddleWare } from "../middlewares/auth.middleware.js";

const BlogRouter = express.Router();

BlogRouter.post("/", AuthMiddleWare.requireUser, BlogController.addNewBlog);
BlogRouter.get("/all", AuthMiddleWare.requireAdmin,BlogController.getAllBlog);
BlogRouter.get("/detail/:blogId", BlogController.getBlogById);
BlogRouter.put("/update", AuthMiddleWare.requireUser, BlogController.updateBlog);
BlogRouter.delete("/delete/:blogId", AuthMiddleWare.requireAdmin, BlogController.deleteBlog)
BlogRouter.delete("/user-delete/:blogId", AuthMiddleWare.requireUser, BlogController.userDeleteBlog)
BlogRouter.post("/upload", upload.array('thumbnail'), BlogController.uploadImage);
BlogRouter.get("/my-blog", AuthMiddleWare.requireUser, BlogController.getBlogByAuthor)
BlogRouter.route("/comment") 
    .get(BlogController.getCommentList)
    .post(AuthMiddleWare.requireUser ,BlogController.addComment)
BlogRouter.get("/like/:blogId", BlogController.getLikeNumber)
BlogRouter.route("/like")
    .get(BlogController.getLikedBlogsByUser)
    .post(AuthMiddleWare.requireUser, BlogController.likeBlog)
    .delete(AuthMiddleWare.requireUser, BlogController.unlikeBlog)
BlogRouter.route("/confirm")
    .put(AuthMiddleWare.requireAdmin ,BlogController.confirmBlog)
    .get(BlogController.getAllConfirmedBlog)
    .delete(AuthMiddleWare.requireAdmin, BlogController.denyBlog)
BlogRouter.get("/pending", AuthMiddleWare.requireAdmin, BlogController.getAllUnconfirmedBlog)

BlogRouter.put("/update-admin", AuthMiddleWare.requireAdmin, BlogController.adminUpdateBlog);

export { BlogRouter };