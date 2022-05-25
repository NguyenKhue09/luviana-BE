import { UserService } from "../services/user.services.js";
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

async function getUser(req, res) {
  const { userId } = req.query;

  const result = await UserService.getUser(userId);

  if (result.success) {
    if (result.data) return res.json(result);
    else return res.status(404).json(result);
  } else {
    return res.status(500).json(result);
  }
}

async function registerUser(req, res) {
  const { avatar, username, password, email } = req.body;

  const result = await UserService.registerUser(
    avatar,
    username,
    password,
    email
  );
  if (result.success) {
    return res.json(result);
  } else {
    console.log(result);
    return res.status(500).json(result);
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  const result = await UserService.login(email, password);
  if (result.success) {
    return res.json(result);
  } else {
    return res.status(401).json(result);
  }
}

// Sign up with mail authentication
async function signUp(req, res) {
    const userData = req.body;

    if (!userData.email || !userData.password) {
        return res.status(400).json({
            success: false,
            message: "Missing required field!",
            data: null
        })
    }

    const passwordRegEx = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/;

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email))) {
        return res.status(400).json({
            success: false,
            message: "Invalid email address!",
            data: null
        })
    }

    const existingUser = await UserService.isExist(userData.email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Your email has been taken, please use other email to signup",
                data: null
            });
        }

    if (!passwordRegEx.test(req.body.password)) { 
        res.status(400).json({
            success: false,
            message: "Password must contains letters, digits and at least 6 characters",
            data: null
        });
    }

    const { email } = userData;
    const token = jwt.sign(userData, process.env.SECRET_TOKEN, { expiresIn: "1h" }); // token hết hạn 1 giờ
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.SENDER,
            pass: process.env.PASSWORD,
        },
    });

  transporter.use(
    "compile",
    pugEngine({
      templateDir: "./template",
      pretty: true,
    })
  );

  const mailOptions = {
    from: process.env.SENDER,
    to: `${email}`,
    subject: "Luviana - Activate your account",
    template: "template",
    ctx: {
      name: userData.username,
      url: process.env.SERVER_URL + "/user/activate/" + token,
    },
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return res.status(400).json({
        message: `Error when send email to ${email}`,
        data: null,
        success: false,
      });
    } else {
      console.log("Email sent: " + info.response);
      return res.json({
        message: `Email has been sent to ${email}`,
        success: true,
        data: null,
      });
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
        data: null,
      });
    }
    const { avatar, username, password } = userData;
    const user = await UserService.registerUser(
      avatar,
      username,
      password,
      email
    );
    const { _id } = user;
    const accessToken = jwt.sign({ id }, process.env.SECRET_TOKEN, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign({ id }, process.env.SECRET_TOKEN_REFRESH, {
      expiresIn: "1y",
    });
    // await saveToken(email, refreshToken, accessToken);
    // return res.redirect(`${process.env.SHOP_ADDR}/register-success/${accessToken}/${refreshToken}`);
    return res.json({
      success: true,
      message: "Activate account successful",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).send({
      success: false,
      message: "Your link has been expired, please signup again",
      data: null,
    });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await UserService.forgotPassword(email);

    if (!user.success) {
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong", data: null });
    }

    const access_token = user.data.accessToken;

    const url = `${CLIENT_URL}/user/reset-password/${access_token}`;

    const result = await sendEmail(email, user.data.username, url, "Luviana - Reset your password");

    if (!result.success) {
      return res
        .status(500)
        .json({ success: false, message: result.message, data: null });
    }

    return res.json({ success: true, message: result.message, data: null });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
}

async function resetPassword(req, res) {
  try {
    const { password } = req.body;
    const userId = req.userId

    const result = await UserService.resetPassord(password, userId)

    if(!result.success) {
        return res
      .status(500)
      .json({ success: false, message: "Reset password failed", data: null });
    }

    return res.json(result)

  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
}

async function getAccessToken(req, res) {
  try {
    const { refreshtoken } = req.query;
    
    if (!refreshtoken)
      return res
        .status(400)
        .json({ success: false, message: "Please login now!", data: null });

    const user = jwt.verify(refreshtoken, process.env.SECRET_TOKEN_REFRESH);

    if (!user.id) {
      return res
        .status(400)
        .json({ success: false, message: "Please login now!", data: null });
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.SECRET_TOKEN, {
      expiresIn: "1d",
    });

    return res.json({
      success: true,
      message: "Get access token success",
      data: {
        accessToken,
      },
    });

  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
}

async function uploadAvatar(req, res) {
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
            message: "Upload avatar successfully",
            data: result.secure_url
        })
    } catch (err) {
        res.json(500).json({
            success: false,
            message: "Upload avatar failed",
            data: null
        })
    }
}

async function updateUser (req, res) {
  try {
    const userId = req.userId
    const userData = req.body

    if (!userData) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide new data!", 
        data: null 
      });
    }

    const result = await UserService.updateUser(userData, userId);

    if (result.success) {
      return res.json(result)
    } else {
      return res.status(500).json(result)
    }
  } catch (err) {
    return res.status(500).json({
      success: false, 
      message: "Update user failed!",
      data: null
    });
  }
}

// Admin API
async function getUserList(req, res) {
  try {
    const response = await UserService.getUserList();
    if (response.success) {
      return res.json(response)
    } else return res.status(500).json(response)
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong ${e.message}`,
      data: null
    });
  }
}

export const UserController = {
  getUser,
  registerUser,
  forgotPassword,
  getAccessToken,
  resetPassword,
  login,
  signUp,
  activate,
  uploadAvatar,
  updateUser,
  getUserList
};
