import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import mongoose from "mongoose";

//Function: middleware of user rights  
//Input: userId from cookie
//Output: allow it to go to the next function or not 
function requireUser (req, res, next) {
    var authHeader = req.headers['authorizationtoken'];

    console.log(authHeader)

    if (authHeader && authHeader.split(' ')[0] !== 'Bearer') return res.status(401).json({
      success: false,
      message: "Authorize Failed",
      data: null
    })
    
    var token = authHeader.split(' ')[1];
    var decodedToken = null;
    
    try {
      decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
      if (decodedToken == null) {
        return res.status(401).json({
          success: false,
          message: "Authorize Failed",
          data: null
        })
      }

      req.userId = decodedToken.id
      next();
    } catch (error) {
      console.log(error)
      return res.status(401).json({
        success: false,
        message: error.message,
        data: null
      })
    }  
  }

//Function: middleware of admin rights  
//Input: adminId from cookie 
//Output:  allow it to go to the next function or not 
async function requireAdmin (req, res, next) { 
    var authHeader = req.headers['authorizationAdmintoken'];

    if(!authHeader) return res.status(400).json({
      success: false,
      message: "Admin unauthorized!",
      data: null
    });

    if (authHeader && authHeader.split(' ')[0] !== 'Bearer') return res.status(400).json({
      success: false,
      message: "Admin unauthorized!",
      data: null
    });
    
    var token = authHeader.split(' ')[1];
    var decodedToken = null;
    
    try {
      decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
      if (decodedToken == null) {
        return res.status(401).json({
          success: false,
          message: "Admin Unauthorized!",
          data: null
        })
      }

      const checkAdminExists = await Admin.exists({ _id: mongoose.Types.ObjectId(decodedToken.id) });
    
      if (!checkAdminExists)
        return res.status(401).json({
          success: false,
          message: "Admin Unauthorized!",
          data: null
        })
      next();
    } catch (error) {
      console.log(error)
      return res.status(401).json({
        success: false,
        message: error.message,
        data: null
      })
    }  
};

export const AuthMiddleWare = {
  requireUser,
  requireAdmin
}