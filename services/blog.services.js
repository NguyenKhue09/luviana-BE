import mongoose from "mongoose";
import Blog from "../models/blog.model.js"
import Users_likes from "../models/users_likes.model.js"
import User from "../models/user.model.js"

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

async function likeBlog(userId, blogId) {

    const checkUserIdExists = await User.exists({ _id: mongoose.Types.ObjectId(userId) })
    const checkBlogExists = await Blog.exists({ _id: mongoose.Types.ObjectId(blogId) })

    if (!checkUserIdExists) {
        return {
            success: false,
            message: "userId is not exists!",
            data: null
        }
    }

    if (!checkBlogExists) {
        return {
            success: false,
            message: "Blog is not exists!",
            data: null
        }
    }

    try {
        const result = await Users_likes.create({
            userId: mongoose.Types.ObjectId(userId),
            blogId: mongoose.Types.ObjectId(blogId)
        });

        if (!result) {
            return {
                success: false,
                message: "Like blog failed!",
                data: null
            }
        } else {
            return {
                success: true,
                message: "Like blog successfully!",
                data: result
            }
        }
    } catch (e) {
        return {
            success: false,
            message: `Unexpected error: ${e.message}`,
            data: null
        }
    }
}

async function getLikeNumber(blogId) {
    const checkBlogExists = await Blog.exists({ _id: mongoose.Types.ObjectId(blogId) })
    if (!checkBlogExists) {
        return {
            success: false,
            message: "Blog is not exists!",
            data: null
        }
    }

    try {
        const result = await Users_likes.countDocuments({ blogId: blogId })
        
        return {
            success: true,
            message: "Get like number successfully!",
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
 
async function unlikeBlog(author, blogId) {
    try {
        const result = await Users_likes.deleteOne({
            userId: mongoose.Types.ObjectId(author),
            blogId: mongoose.Types.ObjectId(blogId)
        });

        if (!result) {
            return {
                success: false,
                message: "Unlike blog failed!",
                data: null
            }
        } else {
            return {
                success: true,
                message: "Unlike blog successfully!",
                data: result
            }
        }
    } catch (e) {
        return {
            success: false,
            message: `Unexpected error: ${e.message}`,
            data: null
        }
    }
}

async function getLikedBlogsByUser(userId) {
    const checkUserIdExists = await User.exists({ _id: mongoose.Types.ObjectId(userId) })
    if (!checkUserIdExists) {
        return {
            success: false,
            message: "User is not exists!",
            data: null
        }
    }

    try {
        const result = await Users_likes.find({ userId: userId }).populate("blogId").select("-userId -_id")
        if (!result) {
            return {
                success: false,
                message: "Get liked blogs by user failed!",
                data: null
            }
        }

        return {
            success: true,
            message: "Get liked blogs by user successfully!",
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
    getBlogByAuthor,
    likeBlog,
    getLikeNumber,
    unlikeBlog,
    getLikedBlogsByUser
}