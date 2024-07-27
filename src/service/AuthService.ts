import LoginRequest from "../models/request/LoginRequest";
import User from "../entity/User";
import RegisterRequest from "../models/request/RegisterRequest";

async function login(req: LoginRequest) {
    try {
        return await User.findOne({phone: req.phone}).exec()
    } catch (error) {
        console.error("[ERROR] Error when #login:", error)
    }
}

async function register(req: RegisterRequest) {
    try {
        return await User.create({
            name: req.name,
            phone: req.phone
        })
    } catch (error) {
        console.error("[ERROR] Error when #register:", error)
    }
}

const authService = {
    login,
    register
}

export default authService