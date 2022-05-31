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
    data.date = new Date();

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

        const result = await Blog.findById(blogId).populate("author")

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

    try {
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

        const checkIfLiked = await Users_likes.exists({ 
            userId: mongoose.Types.ObjectId(userId),
            blogId: mongoose.Types.ObjectId(blogId)
        })

        if (checkIfLiked) {
            return {
                success: false,
                message: "You have already liked this blog!",
                data: null
            }
        }

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
        } else if (result.deletedCount == 0) {
            return {
                success: false,
                message: "You have not liked this blog!",
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

async function userDeleteBlog(userId, blogId) {
    try {
        const result = await Blog.findOneAndDelete({
            _id: mongoose.Types.ObjectId(blogId),
            author: mongoose.Types.ObjectId(userId)
        }, { useFindAndModify: false })

        if(!result) {
            return {
                success: false,
                message: "You are not the author or blog is not exists!",
                data: null
            }
        }

        return {
            success: true,
            message: "Delete blog successfully!",
            data: null
        }
    } catch (e) {
        console.log(e);
        return {
            success: false,
            message: `Unexpected error.`,
            data: null
        }
    }
}

// Admin API

async function confirmBlog(blogId) {
    try {
        const checkBlogExists = await Blog.exists({ _id: mongoose.Types.ObjectId(blogId) })
        if (!checkBlogExists) {
            return {
                success: false,
                message: "Blog is not exists!",
                data: null
            }
        }

        const result = await Blog.findByIdAndUpdate(blogId, { isConfirm: true }, { returnDocument: "after" })
        if (!result) {
            return {
                success: false,
                message: "Confirm blog failed!",
                data: null
            }
        }

        return {
            success: true,
            message: "Confirm blog successfully!",
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

async function denyBlog(blogId) {
    const checkBlogExists = await Blog.exists({ _id: mongoose.Types.ObjectId(blogId), isConfirm: false })
    if (!checkBlogExists) {
        return {
            success: false,
            message: "Blog is not exists or confirmed!",
            data: null
        }
    }

    try {
        await Blog.findByIdAndDelete(blogId);
        return {
            success: true,
            message: "Blog denied!",
            data: null
        }
    } catch (e) {
        return {
            success: false,
            message: "Unexpected error: " + e.message,
            data: null
        }
    }
}

async function deleteBlog(blogId) {
    const checkBlogExists = await Blog.exists({ _id: mongoose.Types.ObjectId(blogId) })
    if (!checkBlogExists) {
        return {
            success: false,
            message: "Blog is not exists!",
            data: null
        }
    }

    try {
        await Blog.findOneAndDelete({ _id: mongoose.Types.ObjectId(blogId) });
        return {
            success: true,
            message: "Delete blog successfully!",
            data: null
        }
    } catch(e) {
        return {
            success: false,
            message: `Unexpected error: ${e.message}`,
            data: null
        }
    }
}

async function getAllUnconfirmedBlog() {
    try {
        const result = await Blog.find({ isConfirm: false }).populate("author")
        if (!result) {
            return {
                success: false,
                message: "Get all unconfirmed blog failed!",
                data: null
            }
        }

        return {
            success: true,
            message: "Get all unconfirmed blog successfully!",
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

// End of Admin API

async function getAllConfirmedBlog(page, limit) {
    try {

        const result = await Blog.find({ isConfirm: true }).skip((page - 1) * limit).limit(limit).populate("author");
        const maxDocument = await Blog.countDocuments({ isConfirm: true });
        const maxPage = Math.ceil(maxDocument / limit);

        if(!result) {
            return {
                success: false,
                message: "Get all confirmed blog failed!",
                data: null
            }
        }

        return {
                success: true,
                message: "List of confirmed blog fetched!",
                data: result,
                maxPage
            }
        
    } catch (error) {
        return {
            success: false,
            message: error.message,
            data: null
        }
    }
}

// async function dropDatabase() {
//     try {
//         await Blog.deleteMany({});
//         return {
//             success: true,
//             message: "Drop database successfully!",
//             data: null
//         }
//     } catch(e) {
//         console.log(e);
//         return {
//             success: false,
//             message: "faild",
//             data: null
//         }
//     }
// }

export const BlogService = {
    addNewBlog,
    updateBlog,
    getAllBlog,
    getBlogById,
    getBlogByAuthor,
    likeBlog,
    getLikeNumber,
    unlikeBlog,
    getLikedBlogsByUser,
    confirmBlog,
    getAllConfirmedBlog,
    getAllUnconfirmedBlog,
    deleteBlog,
    denyBlog,
    userDeleteBlog
}