import LoginRequest from "../models/request/LoginRequest";
import User from "../entity/User";
import RegisterRequest from "../models/request/RegisterRequest";

async function login(req: LoginRequest) {
    console.log(req.phone)
    try {
        return await User.findOne({phone: req.phone}).exec()
    } catch (error) {
        console.error("[ERROR] Error when #login:", error)
    }
}

async function register(req: RegisterRequest) {
    try {
        const user = await User.findOne({name: req.name, phone: req.phone}).exec()
        if (user) {
            console.info("[INFO] Found a user with the same phone number, return the existing user instead")
            return user
        } else {
            return await User.create({
                name: req.name,
                phone: req.phone
            })
        }
        
    } catch (error) {
        console.error("[ERROR] Error when #register:", error)
        return false
    }
}

const authService = {
    login,
    register
}

export default authService