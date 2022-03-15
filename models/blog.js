import mongoose from "mongoose"
import Comment from "./comment.js"

const blogtSchema = new mongoose.Schema({
    author: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: User
    },
    pictures: [
        {
            type: String,
            required: true
        }
    ],
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    comments: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: Comment
    }],
})

const Blog = mongoose.model("Blog", blogtSchema);

export default Blog