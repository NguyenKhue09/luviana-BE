import { AdminService } from "../services/admin.services.js";
import jwt from "jsonwebtoken";

async function getAdmin(req, res) {
  try {
    const adminId = req.adminId;

    const result = await AdminService.getAdmin(adminId);

    if (result.success) return res.json(result);
    else return res.status(404).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Find admin failed!",
      data: null,
    });
  }
}

async function updateAdmin(req, res) {
  try {
    const adminId = req.adminId;
    const adminData = req.body;

    if (!adminData) {
      return res.status(400).json({
        success: false,
        message: "Please provide new data!",
        data: null,
      });
    }

    const result = await AdminService.updateAdmin(adminData, adminId);

    if (result.success) res.json(result);
    else res.status(500).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Update admin failed!",
      data: null,
    });
  }
}

async function loginAdminAccount(req, res) {
  try {
    const { username, password } = req.body;
    const result = await AdminService.loginAdminAccount(username, password);
    if (result.success) {
      return res.json({
          status: 200,
          token: result.data.token
      });
    } else {
      return res.status(401).json({
        status: 401,
        token: null
    });
    }
  } catch (error) {
    return res.status(500).json({
        status: 500,
        token: null
    });
  }
}

async function createAdminAccount(req, res) {
    try {
      const { username, password } = req.body;
      const result = await AdminService.createAdminAccount({username, password});
      if (result.success) {
        return res.json(result);
      } else {
        return res.status(401).json(result);
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }
  

async function getAccessToken(req, res) {
  try {
    const { refreshtoken } = req.query;

    if (!refreshtoken)
      return res
        .status(400)
        .json({ success: false, message: "Please login now!", data: null });

    const admin = jwt.verify(refreshtoken, process.env.SECRET_TOKEN_REFRESH);

    if (!admin.id) {
      return res
        .status(400)
        .json({ success: false, message: "Please login now!", data: null });
    }

    const accessToken = jwt.sign({ id: admin.id }, process.env.SECRET_TOKEN, {
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

async function disableAdminAccount (req, res) {
  try {
    const { adminId } =  req.body;

    if (!adminId) 
      return res
        .status(400)
        .json({ success: false, message: "Please provide admin id now!", data: null });
    
    const result = await AdminService.blockAdminAccount(adminId)

    if (result.success) return res.json(result)
    else return res.status(500).json(result)

  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
}

async function undisableAdminAccount (req, res) {
  try {
    const { adminId } =  req.body;

    if (!adminId) 
      return res
        .status(400)
        .json({ success: false, message: "Please provide admin id now!", data: null });
    
    const result = await AdminService.unblockAdminAccount(adminId)

    if (result.success) return res.json(result)
    else return res.status(500).json(result)

  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
}

export const AdminController = {
  getAdmin,
  updateAdmin,
  getAccessToken,
  loginAdminAccount,
  createAdminAccount,
  disableAdminAccount,
  undisableAdminAccount
};
