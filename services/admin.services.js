import Admin from "../models/admin.model.js";

async function getAdmin(adminId) {
    try {
        const admin = await Admin.findById(adminId)
        if(!admin) {
            return {
                success: true,
                message: "Admin not found!",
                data: null
            }
        }

      return {
        success: true,
        message: "Get admin successful!",
        data: admin,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
}

async function updateAdmin(adminData, adminId) {
    try {
        const  result = await Admin.findByIdAndUpdate(adminId, adminData)

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

async function createAdminAccount(data) {
    try {
        const  admin = await Admin.create(data)

        if(!admin) {
            return {
                success: false,
                message: "Create admin account failed!",
                data: null
            }
        }

        delete admin.password

        const accessToken = await admin.getSignedToken()
        const refreshToken = await admin.getRefreshToken()

        return {
            success: true,
            message: "Create admin account successfully!",
            data: {...admin, accessToken, refreshToken}
        }
    } catch (error) {
        return {
            success: false,
            message: error.message,
            data: null
        } 
    }
}

async function loginAdminAccount(username, password) {
    try {
        const  admin = await Admin.findOne({username}).select("password")

        if(!admin) {
            return {
                success: false,
                message: "Login admin account failed!",
                data: null
            }
        }

        const passwordMatch = await admin.matchPasswords(password);

        if (!passwordMatch) {
            return {
                success: false,
                message: "Invalid credentials",
                data: null
            };
        }

        delete admin.password

        const accessToken = await admin.getSignedToken()
        const refreshToken = await admin.getRefreshToken()

        return {
            success: true,
            message: "Login admin account successfully!",
            data: {token: accessToken}
        }

    } catch (error) {
        return {
            success: false,
            message: error.message,
            data: null
        } 
    }
}

async function blockAdminAccount(adminId) {
    try {
        const result = await Admin.findOneAndUpdate(adminId, {isDisable: true});

        if(!result) {
            return {
                success: false,
                message: "Block admin failed!",
                data: null
            }
        }

        return {
            success: true,
            message: "Block admin successfully!",
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

export const AdminService = {
    getAdmin,
    updateAdmin,
    createAdminAccount,
    loginAdminAccount,
    blockAdminAccount
}

