import mongoose from "mongoose"
import argon2 from "argon2"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import crypto from "crypto"


dotenv.config()


var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a username"]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    avatar: {
        type: String,
        required: [true, "Please provide your avarta"]
    },
    gender: {
        type: String,
        enum: ["male", "famale"]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false,
    },
    phone: {
        type: String
    },
    dob: {
        type: Date
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: {
        type: Date,
    },
    refreshToken: {
        type: String,
    },
})


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await argon2.hash(this.password);
    next();
});

userSchema.methods.matchPasswords = async function (password) {

    console.log(await this.model("posts").find({}));

    return await argon2.verify(this.password, password);
};

userSchema.methods.getSignedToken = function () {
    return jwt.sign({ id: this._id }, process.env.SECRET_TOKEN, {
      expiresIn: process.env.EXPIRE_TOKEN,
    });
};

userSchema.methods.getRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.SECRET_TOKEN_REFRESH, {
      expiresIn: process.env.EXPIRE_REFRESH_TOKEN,
    });
};
  
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    console.log("User: ", this.resetPasswordToken);
  
    this.resetPasswordExpire = Date.now() + (10 * 60 * 1000);
  
    return resetToken;
};
  
userSchema.methods.verifyRefreshToken = function (refreshToken) {
    return jwt.verify(refreshToken, process.env.SECRET_TOKEN_REFRESH);
}

const User = mongoose.model("User", userSchema);

export default User