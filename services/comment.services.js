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

async function getCommentList(blogId, page, limit) {
   
    try {
        const checkBlogExists = await Blog.exists({ _id: mongoose.Types.ObjectId(blogId) })
        if (!checkBlogExists) {
            return {
                success: false,
                message: "Blog is not exists!",
                data: null
            }
        }

        const result = await Blog.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(blogId) } },
            { $project: { comments: 1, total: { $size: "$comments" } } },
            { $set : { comments: {
                $slice: [ "$comments", (page - 1) * limit, limit ]
            }}}
        ])

        if (result.length == 0) {
            return {
                success: true,
                message: "No comments found!",
                data: []
            }
        }
        const final = await Blog.populate(result, { path: "comments"});
        final[0].currentPage = page
        final[0].maxPage = Math.ceil(result[0].total / limit);
        
        return {
            success: true,
            message: "Comment list fetched!",
            data: final[0]
        }

    } catch (e) {
        return {
            success: false,
            message: e.message,
            data: null
        }
    }
}

export const CommentService = {
    addComment,
    getCommentList
}