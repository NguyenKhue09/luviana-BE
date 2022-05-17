import mongoose from "mongoose"
import User from "./user.model.js"


const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Types.ObjectId,
        required: [true, "Author of comment is required!"],
        ref: User
    },
    content: {
        type: String,
        required: [true, "Content of comment is required!"]
    },
    vote: {
        type: Number,
        required: [true, "Vote of comment is required!"]
    },
    date: {
        type: Date,
        required: [true, "Date of comment is required!"]
    }
})

const Comment = mongoose.model("Comment", commentSchema);

export default Comment