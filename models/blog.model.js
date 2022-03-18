import mongoose from "mongoose"
import Comment from "./comment.js"

const blogtSchema = new mongoose.Schema({
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
        required: [true, "Content of blog is reuired!"]
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

const Blog = mongoose.model("Blog", blogtSchema);

export default Blog