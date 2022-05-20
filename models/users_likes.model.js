import mongoose from "mongoose";
import Blog from "./blog.model.js";
import User from "./user.model.js";

const users_likesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true, "UserId is required!"],
        ref: User
    },
    blogId: {
        type: mongoose.Types.ObjectId,
        required: [true, "BlogId is required!"],
        ref: Blog
    }
})
users_likesSchema.index({ userId: 1, blogId: 1 }, { unique: true }); // set 2 khoá chính

const Users_likes = mongoose.model("Users_likes", users_likesSchema);

export default Users_likes;