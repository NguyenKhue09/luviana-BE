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
        const user = await User.create({avatar, username, password, email})
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

        return {
            success: true,
            message: "Login successful!",
            data: user
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
        const  result = User.findByIdAndUpdate(userId, userData)

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
  
export const UserService = { 
    getUser,
    registerUser,
    login,
    updateUser
}
