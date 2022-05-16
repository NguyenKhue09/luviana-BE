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

async function updateBlog(data, blogId) {
    try {

        const result = await Blog.findByIdAndUpdate(blogId, data)

        if(!result) {
            return {
                success: false,
                message: "Update blog failed!",
                data: null
            }
        }

        return {
                success: true,
                message: "Update blog successful",
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
                message: "Get blog by id successful",
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
                message: "Get all blog successful",
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

export default BlogServices = {
    addNewBlog,
    updateBlog,
    getAllBlog
}