import { UserService } from "../services/user.services.js";
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"
import fs from "fs"
import { pugEngine } from "nodemailer-pug-engine"

async function getUser(req, res) {
    const { userId } = req.query

    const result = await UserService.getUser(userId)

    if (result.success) {
        if (result.data) return res.json(result)
        else return res.status(404).json(result)
    } else {
        return res.status(500).json(result)
    }

}

async function registerUser(req, res) {
    const { avatar, username, password, email } = req.body

    const result = await UserService.registerUser(avatar, username, password, email)
    if (result.success) {
        return res.json(result)
    } else {
        console.log(result)
        return res.status(500).json(result)
    }
}

async function login(req, res) {
    const { email, password } = req.body
    const result = await UserService.login(email, password)
    if (result.success) {
        return res.json(result)
    } else {
        return res.status(401).json(result)
    }
}

// Sign up with mail authentication
async function signUp(req, res) {
    const userData = req.body;
    const { email } = userData;
    const token = jwt.sign(userData, process.env.SECRET_TOKEN, { expiresIn: "1h"}); // token hết hạn 1 giờ
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.SENDER,
            pass: process.env.PASSWORD,
        },
    });

    transporter.use('compile', pugEngine({
        templateDir: "./template",
        pretty: true
    }))

    const mailOptions = {
        from: process.env.SENDER,
        to: `${email}`,
        subject: "Luviana - Activate your account",
        template: "template",
        ctx: {
            name: userData.username,
            url: process.env.SERVER_URL + "/user/activate/" + token
        }

    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return res.status(400).json({ message: `Error when send email to ${email}`, data: null, success: false });
        } else {
            console.log("Email sent: " + info.response);
            return res.json({ message: `Email has been sent to ${email}`, success: true, data: null });
        }
    });
}

async function activate(req, res) {
    try {
        const { token } = req.params;
        const userData = jwt.verify(token, process.env.SECRET_TOKEN);
        const { email } = userData;
        const existingUser = await UserService.isExist(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Your email has been taken, please use other email to signup",
                data: null
            });
        }
        const { avatar, username, password } = userData;
        const user = await UserService.registerUser(avatar, username, password, email);
        const { _id } = user;
        const accessToken = jwt.sign({ email }, process.env.SECRET_TOKEN, { expiresIn: "1d" });
        const refreshToken = jwt.sign({ _id }, process.env.SECRET_TOKEN_REFRESH, { expiresIn: "1y" });
        // await saveToken(email, refreshToken, accessToken);
        // return res.redirect(`${process.env.SHOP_ADDR}/register-success/${accessToken}/${refreshToken}`);
        return res.json({
            success: true,
            message: "Activate account successful",
            data: {
                accessToken,
                refreshToken
            }
        })
    } catch (err) {
        console.log(err.message);
        res.status(400).send({ success: false, message: "Your link has been expired, please signup again", data: null });
    }
}

async function uploadAvatar(req, res) {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database

    var finalImg = {
        contentType: req.file.mimetype,
        image: Buffer.from(encode_image, 'base64')
    };
    return res.json({
        success: true,
        message: "Upload avatar successful",
        data: `${process.env.SERVER_URL}/uploads/${req.file.filename}`
    })
}

export const UserController = {
    getUser,
    registerUser,
    login,
    signUp,
    activate,
    uploadAvatar
}