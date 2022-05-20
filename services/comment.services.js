import Comment from "../models/comment.model.js";
import Blog from "../models/blog.model.js";
import mongoose from "mongoose";

async function addComment(author, blogId, content) {
    const session = await mongoose.startSession();
    session.startTransaction();
    let result
    try {
        const comment = new Comment({
            author,
            content,
            vote: 0,
            date: new Date()
        }, { session })
        await comment.save()
        result = await Blog.findOneAndUpdate({ _id: mongoose.Types.ObjectId(blogId) }, { $push: { comments: comment._id } }, { session, returnDocument: "after" })
        if (!result) {
            throw new Error("Comment not saved!")
        }
        await session.commitTransaction();
        session.endSession();
    } catch (e) {
        return{
            success: false,
            message: e.message,
            data: null
        }
    }

    return {
        success: true,
        message: "Comment saved!",
        data: result
    }
}

async function getCommentList(blogId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    let result = []
    
    try {
        const { comments } = await Blog.findOne({ _id: mongoose.Types.ObjectId(blogId) }, { comments: 1 }, { session })
        if (!comments) {
            return {
                success: true,
                message: "No comments found!",
                data: []
            }
        }
        result = await Comment.find({ _id: { $in: comments } }, {}, { session })
        await session.commitTransaction();
        session.endSession();
    } catch (e) {
        return {
            success: false,
            message: e.message,
            data: null
        }
    }

    return {
        success: true,
        message: "Comment list fetched!",
        data: result
    }
}

export const CommentService = {
    addComment,
    getCommentList
}