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

    data.author = req.userId;

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
    const { data, blogId } = req.body;
    const author = req.userId;

    if (!blogId || !data) {
        return res.status(400).json({
            success: false,
            message: "Missing required field!",
            data: null
        })
    }

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
        const response = await BlogService.getAllBlog();

        if (response.success) {
            return res.json(response)
        } else return res.status(500).json(response)
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: `Something went wrong: ${e.message}`,
            data: null
        })
    }
}

async function uploadImage(req, res) {
    let streamUpload = (file) => {
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

            streamifier.createReadStream(file.buffer).pipe(stream);
        });
    };

    async function upload(files) {
        let results = [];
        for (const file of files)
            results.push(await streamUpload(file));
        return results.map(r => r.secure_url);
    }

    try {
        const result = await upload(req.files);
        return res.json({
            success: true,
            message: "Upload images successfully",
            data: result
        })
    } catch (err) {
        //console.log(err);
    }
}

async function getBlogByAuthor(req, res) {
    const author = req.userId;
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
    const { blogId, content } = req.body;
    const author = req.userId;

    if (!author || !blogId || !content) {
        return res.status(400).json({
            success: false,
            message: "Missing required field!",
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
    const { blogId } = req.body;
    const userId = req.userId

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
    const { blogId } = req.body;
    const userId = req.userId;

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

async function userDeleteBlog(req, res) {
    const { blogId } = req.params;
    const userId = req.userId;

    if (!blogId) {
        return res.status(400).json({
            success: false,
            message: "Please provide blog id.",
            data: null
        })
    }

    try {
        const response = await BlogService.userDeleteBlog(userId, blogId);

        if (response.success) return res.json(response)
        else return res.status(500).json(response)
    } catch (e) {
        //console.log(e);
        return res.status(500).json({
            success: false,
            message: `Something went wrong.`,
            data: null
        })
    }
}

// Admin API

async function confirmBlog(req, res) {
    const blogId = req.body._id;

    if (!blogId) {
        return res.status(400).json({
            success: false,
            message: "Please provide blog id.",
            data: null
        })
    }

    try {
        const response = await BlogService.confirmBlog(blogId);

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

async function deleteBlog(req, res) {
    const { blogId } = req.params;

    if (!blogId) {
        return res.status(400).json({
            success: false,
            message: "Please provide blog id!",
            data: null
        })
    }

    try {
        const response = await BlogService.deleteBlog(blogId);
        if (response.success) {
            return res.json(response)
        } else return res.status(500).json(response)
    } catch (e) {
        return res.json(500).json({
            success: false,
            message: `Something went wrong: ${e.message}`,
            data: null
        })
    }
}

async function denyBlog(req, res) {
    const blogId = req.body._id;
    if (!blogId) {
        return res.status(400).json({
            success: false,
            message: "Please provide blog id!",
            data: null
        })
    }

    try {
        const response = await BlogService.denyBlog(blogId);
        if (response) return res.json(response)
        else return res.status(500).json(response)
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: `Something went wrong: ${e.message}`,
            data: null
        })
    }
}

async function getAllUnconfirmedBlog(req, res) {
    try {
        const response = await BlogService.getAllUnconfirmedBlog();
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

async function adminUpdateBlog(req, res) {
    const { content, pictures } = req.body;
    const blogId = req.body._id;

    if (!blogId) {
        return res.status(400).json({
            success: false,
            message: "Please provide blog id.",
            data: null
        })
    }

    const data = { content, pictures };

    if (data.content == "") {
        return res.status(400).json({
            success: false,
            message: "Content cannot be empty!",
            data: null
        })
    }

    try {
        const response = await BlogService.adminUpdateBlog(blogId, data);

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

// End of Admin API

async function getAllConfirmedBlog(req, res) {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    try {
        const response = await BlogService.getAllConfirmedBlog(page, limit);

        if (response.success) {
            return res.json(response)
        } else return res.status(500).json(response)
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: `Something went wrong: ${e.message}`,
            data: null
        })
    }
}

async function dropDatabase(req, res) {
    const response = await BlogService.dropDatabase();
    if (response.success) return res.json(response)
    else return res.status(500).json(response)
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
    getLikedBlogsByUser,
    confirmBlog,
    getAllConfirmedBlog,
    deleteBlog,
    denyBlog,
    dropDatabase,
    getAllUnconfirmedBlog,
    userDeleteBlog,
    adminUpdateBlog
}