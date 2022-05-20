
//Function: middleware of user rights  
//Input: userId from cookie
//Output: allow it to go to the next function or not 
function requireUser (req, res, next) {
    var authHeader = req.headers['authorizationtoken'];

    if (authHeader && authHeader.split(' ')[0] !== 'Bearer') return  res.status(400).json({
      success: false,
      message: "Authorize Failed",
      data: null
    })
    
    var token = authHeader.split(' ')[1];
    var decodedToken = null;
    
    try {
      decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
      if (decodedToken == null) {
        return res.status(400).json({
          success: false,
          message: "Authorize Failed",
          data: null
        })
      }

      req.userId = decodedToken.id
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Authorize Failed",
        data: null
      })
    }  
  }

//Function: middleware of admin rights  
//Input: adminId from cookie 
//Output:  allow it to go to the next function or not 
function requireAdmin (req, res, next) { 
    // var authHeader = req.headers['authorizationAdmintoken'];

    // if (authHeader && authHeader.split(' ')[0] !== 'Bearer') resHelper(res, 401, {error: 'Unauthorized'}, 'Unauthorized');
    // if (_.isNil(authHeader)) return resHelper(res, 401, {error: 'Unauthorized'}, 'Unauthorized');
    
    // var token = authHeader.split(' ')[1];
    // var decodedToken = null;
    
    // try {
    //   decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    //   var currentUser = await User.get({name: decodedToken.userName});
    //   if (_.isNil(currentUser)) return resHelper(res, 400, {error: 'bad request'}, 'Bad request');
    //   res.locals.admin = currentUser;
    // } catch (error) {
    //   return resHelper(res, 400, {error: 'bad request'}, 'Bad request');
    // }

    // if (_.isNil(decodedToken)) return resHelper(res, 400, {error: 'bad request'}, 'Bad request');
    // next();
};

export const AuthMiddleWare = {
  requireUser
}