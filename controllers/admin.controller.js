import { AdminService } from '../services/admin.services.js'
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { pugEngine } from "nodemailer-pug-engine";
import { sendEmail } from "./sendEmail.js";
import cloudinaryInstance from "cloudinary"
import streamifier from "streamifier"

const { CLIENT_URL } = process.env;


const cloudinary = cloudinaryInstance.v2
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

async function getAdmin (req, res) {
    try {
        const adminId = req.adminId

        const result = await AdminService.getAdmin(adminId)

        if (result.success) return res.json(result)
        else return res.status(404).json(result)
    } catch (err) {
        return res.status(500).json({
            success: false, 
            message: "Find admin failed!",
            data: null
        });
    }
}


async function updateAdmin (req, res) {
    try {
        const adminId = req.adminId
        const adminData = req.body

        if (!adminData) {
            return res.status(400).json({ 
              success: false, 
              message: "Please provide new data!", 
              data: null 
            });
        }

        const result = await AdminService.updateAdmin(adminData, adminId)

        if (result.success) res.json(result)
        else res.status(500).json(result)

    } catch (err) {
        return res.status(500).json({
            success: false, 
            message: "Update admin failed!",
            data: null
        });
    }
}

export const AdminController = {
    getAdmin,
    updateAdmin
}