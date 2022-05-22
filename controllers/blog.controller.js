import { BlogService } from '../services/blog.services.js';
import { CommentService } from '../services/comment.services.js';
import cloudinaryInstance from "cloudinary"
import streamifier from "streamifier"

const cloudinary = cloudinaryInstance.v2
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

async function addNewBlog(req, res) {
    const data = req.body;

    if (!data.author || !data.content) {
        return res.status(400).json({
            success: false,
            message: "Missing required field!",
            data: null
        })
    }

    data.date = new Date();

    try {
        const response = await BlogService.addNewBlog(data);

        if (response.success) return res.json(response)
        else return res.status(500).json(response)

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Something went wrong: ${error.message}`,
            data: null
        })
    }
}

async function updateBlog(req, res) {
    const { data, blogId, author } = req.body;

    if (data.author != undefined) {
        delete data["author"];
    }

    if (data.comments != undefined) {
        delete data["comment"];
    }

    if (data.date != undefined) {
        delete data["date"];
    }

    if (data.content == "") {
        return res.status(400).json({
            success: false,
            message: "Content cannot be empty!",
            data: null
        })
    }

    try {
        const response = await BlogService.updateBlog(data, blogId, author);

        if (response.success) return res.json(response)
        else return res.status(500).json(response)
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: `Something went wrong: ${e.message}`,
            data: null
        })
    }
}

async function getBlogById(req, res) {
    const { blogId } = req.params;

    if (!blogId) return res.status(400).json({
        success: false,
        message: "Please provide Blog Id.",
        data: null
    })

    try {
        const response = await BlogService.getBlogById(blogId);

        if (response.success) return res.json(response)
        else return res.status(500).json(response)
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: `Something went wrong: ${e.message}`,
            data: null
        })
    }
}

async function getAllBlog(req, res) {
    try {
        const result = await BlogService.getAllBlog();

        if (!result) {
            return res.status(500).json({
                success: false,
                message: "Get all blog failed!",
                data: null
            })
        } else {
            return res.json({
                success: true,
                message: "Get all blog successfully!",
                data: result
            })
        }
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: `Something went wrong: ${e.message}`,
            data: null
        })
    }
}

async function uploadImage(req, res) {
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };

    async function upload(req) {
        return await streamUpload(req);
    }

    try {
        const result = await upload(req);
        return res.json({
            success: true,
            message: "Upload image successfully",
            data: result.secure_url
        })
    } catch (err) {
        console.log(err);
    }
}

async function getBlogByAuthor(req, res) {
    const { author } = req.params;
    if (!author) {
        res.status(400).json({
            success: false,
            message: "Please provide author id.",
            data: null
        })
    }

    try {
        const response = await BlogService.getBlogByAuthor(author);

        if (response.success) {
            return res.status(200).json(response)
        } else return res.status(500).json(response)
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: `Unexpected error: ${e.message}`,
            data: null
        })
    }
}

async function addComment(req, res) {
    const { author, blogId, content } = req.body;

    if (!author || !blogId || !content) {
        return res.status(400).json({
            success: false,
            message: "Missing required field!",
            data: null
        })
    }

    if (content == "") {
        return res.status(400).json({
            success: false,
            message: "Content cannot be empty!",
            data: null
        })
    }

    try {
        const response = await CommentService.addComment(author, blogId, content);

        if (response.success) return res.json(response)
        else return res.status(500).json(response)
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: `Something went wrong: ${e.message}`,
            data: null
        })
    }
}


async function getCommentList(req, res) {
    const { blogId } = req.query;

    if (!blogId) {
        return res.status(400).json({
            success: false,
            message: "Please provide blog id.",
            data: null
        })
    }

    try {
        const page = parseInt(req.query.page) || 1;
        if (page < 1) {
            return res.status(400).json({
                success: false,
                message: "Page must be greater than 0",
                data: null
            })
        }
        const limit = parseInt(req.query.limit) || 10;
        if (limit < 1) {
            return res.status(400).json({
                success: false,
                message: "Limit must be greater than 0",
                data: null
            })
        }
        const response = await CommentService.getCommentList(blogId, page, limit);

        if (response.success) return res.json(response)
        else return res.status(500).json(response)
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: `Something went wrong: ${e.message}`,
            data: null
        })
    }
}

async function likeBlog(req, res) {
    const { blogId, userId } = req.body;

    if (!blogId || !userId) {
        return res.status(400).json({
            success: false,
            message: "Missing required field!",
            data: null
        })
    }

    try {
        const response = await BlogService.likeBlog(userId, blogId);

        if (response.success) return res.json(response)
        else return res.status(500).json(response)
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: `Something went wrong: ${e.message}`,
            data: null
        })
    }
}

async function getLikeNumber(req, res) {
    const { blogId } = req.params;

    if (!blogId) {
        return res.status(400).json({
            success: false,
            message: "Please provide blog id.",
            data: null
        })
    }

    try {
        const response = await BlogService.getLikeNumber(blogId);
        if (response.success) return res.json(response)
        else return res.status(500).json(response)
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: `Something went wrong: ${e.message}`,
            data: null
        })
    }
}

async function unlikeBlog(req, res) {
    const { blogId, userId } = req.body;

    if (!blogId || !userId) {
        return res.status(400).json({
            success: false,
            message: "Missing required field!",
            data: null
        })
    }

    try {
        const response = await BlogService.unlikeBlog(userId, blogId);

        if (response.success) return res.json(response)
        else return res.status(500).json(response)
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: `Something went wrong: ${e.message}`,
            data: null
        })
    }
}

async function getLikedBlogsByUser(req, res) {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "Please provide author id.",
            data: null
        })
    }

    try {
        const response = await BlogService.getLikedBlogsByUser(userId);

        if (response.success) return res.json(response)
        else return res.status(500).json(response)
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: `Something went wrong: ${e.message}`,
            data: null
        })
    }
}

export const BlogController = {
    addNewBlog,
    updateBlog,
    getBlogById,
    getAllBlog,
    uploadImage,
    getBlogByAuthor,
    addComment,
    getCommentList,
    likeBlog,
    getLikeNumber,
    unlikeBlog,
    getLikedBlogsByUser
}