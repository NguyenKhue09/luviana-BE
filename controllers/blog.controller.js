import { BlogService } from '../services/blog.services.js';
import cloudinaryInstance from "cloudinary"
const cloudinary = cloudinaryInstance.v2
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

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

export const BlogController = {
    addNewBlog,
    updateBlog,
    getBlogById,
    getAllBlog,
    uploadImage
}