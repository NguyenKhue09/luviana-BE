import mongoose from "mongoose";
import Blog from "../models/blog.model.js"

async function addNewBlog(data) {

    try {
        const result = await Blog.create(data)

        if(!result) {
            return {
                success: false,
                message: "Create new blog failed!",
                data: null
            }
        }

        return {
            success: true,
            message: "Create new blog successful",
            data: result
        }
        
    } catch (error) {
        return {
            success: false,
            message: error.message,
            data: null
        }
    }

}

async function updateBlog(data, blogId, author) {
    try {

        const result = await Blog.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(blogId),  
            author: mongoose.Types.ObjectId(author)
        }, data, { returnDocument: "after" })

        if(!result) {
            return {
                success: false,
                message: "You are not the author or blog is not exists!",
                data: null
            }
        }

        return {
                success: true,
                message: "Update blog successfully!",
                data: result
            }
        
    } catch (error) {
        return {
            success: false,
            message: error.message,
            data: null
        }
    }
}

async function getBlogById(blogId) {
    try {

        const result = await Blog.findById(blogId)

        if(!result) {
            return {
                success: false,
                message: "Get blog by id failed!",
                data: null
            }
        }

        return {
                success: true,
                message: "Get blog by id successfully!",
                data: result
            }
        
    } catch (error) {
        return {
            success: false,
            message: error.message,
            data: null
        }
    }
}

async function getAllBlog() {
    try {

        const result = await Blog.find({})

        if(!result) {
            return {
                success: false,
                message: "Get all blog failed!",
                data: null
            }
        }

        return {
                success: true,
                message: "Get all blog successfully",
                data: result
            }
        
    } catch (error) {
        return {
            success: false,
            message: error.message,
            data: null
        }
    }
}

async function getBlogByAuthor(author) {
    try {
        const result = await Blog.find({ author: author })
        if (!result) {
            return {
                success: false,
                message: "Get blog by author failed!",
                data: null
            }
        }

        return {
            success: true,
            message: "Get blog by author successfully!",
            data: result
        }
    } catch (e) {
        return {
            success: false,
            message: `Unexpected error: ${e.message}`,
            data: null
        }
    }
}

export const BlogService = {
    addNewBlog,
    updateBlog,
    getAllBlog,
    getBlogById,
    getBlogByAuthor
}