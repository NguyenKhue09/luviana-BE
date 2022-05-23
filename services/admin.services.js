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
        const  result = Admin.findByIdAndUpdate(adminId, adminData)

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


export const AdminService = {
    getAdmin,
    updateAdmin
}

