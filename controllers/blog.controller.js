import { BlogService } from '../services/blog.services.js';

async function addNewBlog(req, res) {
    const { author, content, pictures, date } = req.body;

    if (!author || !content || !pictures || !date) {
        return res.status(400).json({
            success: false,
            message: "Missing required field!",
            data: null
        })
    }

    try {
        const result = await BlogService.addNewBlog(req.body);

        if (!result) {
            return res.status(500).json({
                success: false,
                message: "Create new blog failed!",
                data: null
            })
        }

        return res.json({
            success: true,
            message: "Create new blog successfully!",
            data: result
        })
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

    if (!data.author) {
        delete data["author"];
    }

    if (!data.comments) {
        delete data["comment"];
    }

    try {
        const response = await BlogService.updateBlog(data, blogId);

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
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    return res.json({
        success: true,
        message: "Upload image successfully",
        data: `${process.env.SERVER_URL}/uploads/${req.file.filename}`
    })
}

export const BlogController = {
    addNewBlog,
    updateBlog,
    getBlogById,
    getAllBlog,
    uploadImage
}