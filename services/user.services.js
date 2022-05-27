import User from "../models/user.model.js";

async function getUser(userId) {
    try {
        const user = await User.findById(userId)
        if(!user) {
            return {
                success: true,
                message: "User not found!",
                data: null
            }
        }

      return {
        success: true,
        message: "Get user successful!",
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
}

async function registerUser(avatar, username, password, email) {
    try {
<<<<<<< HEAD

        const checkEmailExist = await User.exists({ email });
        if (checkEmailExist) {
            return {
                success: false,
                message: "Email is already taken",
                data: null
            }
        }

        const user = await User.create({avatar, username, password, email})
=======
        const user = await User.create({avatar, username, password, email}).select("-password")
>>>>>>> ea708fd08a53b513e36b36717784818a0d884cb0
        if(!user) {
            return {
                success: false,
                message: "Error when create user",
                data: null
            };
        }

        return {
            success: true,
            message: "Create user successful!",
            data: user
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
            data: null
        };
    }
}

async function login(email, password) {
    try {
        const user = await User.findOne({ email }).select("+password");

        if(!user) {
            return {
                success: false,
                message: "Invalid credentials",
                data: null
            };
        }

        const passwordMatch = await user.matchPasswords(password);

        if (!passwordMatch) {
            return {
                success: false,
                message: "Invalid credentials",
                data: null
            };
        }

        delete user.password

        const accessToken = await user.getSignedToken()
        const refreshToken =  await user.getRefreshToken()

        return {
            success: true,
            message: "Login successful!",
            data: {...user._doc, accessToken, refreshToken}
        }

    } catch (error) {
        return {
            success: false,
            message: error.message,
            data: null
        };
    }
}

async function updateUser(userData, userId) {
    try {
        const  result = await User.findByIdAndUpdate(userId, userData)

        if(!result) {
            return {
                success: false,
                message: "Update user information failed!",
                data: null
            }
        }

        return {
            success: true,
            message: "Update user information successfully!",
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

async function isExist(email) {
    const user = await User.findOne({ email });
    if (!user) 
        return false;
    return true;
}

async function forgotPassword(email) {
    try {
        const user = await User.findOne({email})

        if(!user) return {
            success: false,
            message: "This email does exists.",
            data: null
        }

        const accessToken = await user.getSignedToken()

        return {
            success: true,
            message:  "Get access token for forgotPassword success",
            data: {
                ...user._doc,
                accessToken
            }
        }

    } catch (error) {
        return {
            success: false,
            message: error.message,
            data: null
        }
    }
}

async function resetPassord(password, userId) {
    try {
        const user = await User.findById(userId)

        if(!user) {
            return {
                success: false,
                message: "User not found",
                data: null
            }
        }

        user.password  = password

        await user.save()

        return {
            success: true,
            message: "Reset password success",
            data: user
        }
    } catch (error) {
        return {
            success: false,
            message: error.message,
            data: null
        }
    }
}

// Admin API 
async function getUserList() {
    try {
        const users = await User.find()
        return {
            success: true,
            message: "Get user list successfully!",
            data: users
        }
    } catch (e) {
        return {
            success: false,
            message: `Unexpected error: ${e.message}`,
            data: null
        }
    }
}
  
export const UserService = { 
    getUser,
    registerUser,
    login,
    updateUser,
    forgotPassword,
    resetPassord,
    isExist,
    getUserList
}
