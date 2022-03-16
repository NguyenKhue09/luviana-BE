const userService = require('../services/user.services');

//Function: wont let user create new user when missing data
//Input: creating user form 
//Output:  allow to move to next function or not
// Only use when sign up with web's user
module.exports.createUser = async (req, res, next) => {
  var errors = [];

  var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;

  // const findUser = await userService.findOneUser({ Gmail: req.body.gmail });
  
  // if(findUser) {
  //   errors.push("Gmail đã tồn tại, vui lòng sử dụng gmail khác");
  // }

  if (!req.body.name) {
    errors.push("Yêu cầu nhập tên")
  }

  if(!regName.test(req.body.name)){
    errors.push("Họ và tên không hợp lệ");
  }

  if (!req.body.email) {
    errors.push("Yêu cầu có Email");
  }

  if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email))) {
    errors.push("Email không hợp lệ");
  }

  if (!req.body.password) { //check if there is password 
    errors.push("Yêu cầu mật khẩu");
  }

  if (!req.body.repassword) {
    errors.push("Yêu cầu nhập lại mật khẩu");
  }

  if (req.body.repassword != req.body.password) {
    errors.push("Mật khẩu không trùng nhau, xin vui lòng thử lại!!!");
  }

  if (!req.body.password.length < 6) {
    errors.push("Độ dài tối thiểu là 6 ký tự")
  }

  var passwordPoint = passwordStrength(req.body.password) 
  var passwordStrength = ""
  
  switch(passwordPoint) {
    case 0: 
      passwordStrength = "Mật khẩu yếu"
    case 25: 
      passwordStrength = "Mật khẩu khá yếu"
    case 50:
      passwordStrength = "Mật khẩu trung bình"
    case 75:
      passwordStrength = "Mật khẩu tốt"
    case 100:
      passwordStrength = "Mật khẩu mạnh"
  }

  if (errors.length > 0) {
    // res.render('registration', {
    //   errors: errors, // put in one object errors to /create with the value of errors
    //   value: req.body,
    //   csrf: req.csrfToken()
    // }) 
    // return;
  }

  next(); // move to next middleware(function)
}

//Function: wont let login when missing data
//Input: login form  
//Output:  allow to move to next function or not
module.exports.loginValidate= (req, res, next) => {
  var errors = [];

  if (!req.body.gmail) {
    errors.push("Yêu cầu có Email");
  }

  if (!req.body.password) { //check if there is password 
    errors.push("Yêu cầu mật khẩu");
  }

  if (errors.length > 0) {
    // res.render('/auth/login', {
    //   errors: errors, // put in one object errors to /create with the value of errors
    //   value: req.body // to save the supplied info 
    // }) 
    // return;
  }

  next(); // move to next middleware(function
}

function passwordStrength(password, message) {
  var strength=0;

  if (password.match(/[a-z]+/)){
      strength+=1;
  }

  if (password.match(/[A-Z]+/)){
      strength+=1;
  }

  if (password.match(/[0-9]+/)){
      strength+=1;
  }

  if (password.match(/[$@#&!]+/)){
      strength+=1;

  }

  switch(strength){
    case 0:
        return 0;

    case 1:
        return 25;

    case 2:
        return 50;

    case 3:
        return 75;

    case 4:
        return 100;
  }

  return 100
}

