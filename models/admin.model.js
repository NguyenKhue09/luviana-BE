import mongoose from "mongoose"
import argon2 from "argon2"
import jwt from "jsonwebtoken"

const adminSchema = new mongoose.Schema({
    username: String,
    password: String
});

adminSchema.pre('save', async function (next) {
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } else {
        next();
    }
});

adminSchema.methods.matchPasswords = async function (password) {

    await this.model("User").find({});

    return await argon2.verify(this.password, password);
};

adminSchema.methods.getSignedToken = function () {
    return jwt.sign({ id: this._id }, process.env.SECRET_TOKEN, {
      expiresIn: process.env.EXPIRE_TOKEN,
    });
};

adminSchema.methods.getRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.SECRET_TOKEN_REFRESH, {
      expiresIn: process.env.EXPIRE_REFRESH_TOKEN,
    });
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;