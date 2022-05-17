import { UserService } from "../services/user.services.js";

async function getUser(req, res) {
    const { userId } = req.query

    const result = await UserService.getUser(userId)

    if (result.success) {
        if (result.data) return res.json(result)
        else return res.status(404).json(result)
    } else {
        return res.status(500).json(result)
    }

}

async function registerUser(req, res) {
    const { avatar, username, password, email } = req.body

    const result = await UserService.registerUser(avatar, username, password, email)
    if (result.success) {
        return res.json(result)
    } else {
        console.log(result)
        return res.status(500).json(result)
    }
}

async function login(req, res) {
    const { email, password } = req.body
    const result = await UserService.login(email, password)
    if (result.success) {
        return res.json(result)
    } else {
        return res.status(401).json(result)
    }
}

export const UserController = { 
    getUser,
    registerUser,
    login
}