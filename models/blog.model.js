import mongoose from "mongoose"
import Comment from "./comment.model.js"
import User from "./user.model.js"

const blogSchema = new mongoose.Schema({
    author: {
        type: mongoose.Types.ObjectId,
        required: [true, "Author of blog is required!"],
        ref: User
    },
    pictures: [
        {
            type: String,
            required: [true, "Picture of blog is required!"]
        }
    ],
    content: {
        type: String,
        required: [true, "Content of blog is required!"]
    },
    date: {
        type: Date,
        required: [true, "Date of blog is required!"]
    },
    comments: [{
        type: mongoose.Types.ObjectId,
        required: [true, "Id comment of blog is required!"],
        ref: Comment
    }],
})

const Blog = mongoose.model("Blog", blogSchema);

export default Blog