import userModel from "../model/user.model.js";
import validator from 'validator'
import bcrypt from 'bcryptjs'
import createWebToken from "../utils/generateJwtToken.js";

const signUp = async (req, res) => {
    try {
        const { username, fullname, email, password } = req.body

        if (!validator.isEmail(email)) return res.status(404).json({ success: false, message: "Email is not valid" })

        const existEmail = await userModel.findOne({ email })
        const existUsername = await userModel.findOne({ username })

        if (existEmail || existUsername) return res.status(400).json({ success: false, message: "User already registered" })

        if (password.length < 6) return res.status(400).json({ success: false, message: "Password should be more than 6 char " })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await userModel.create({
            fullname,
            username,
            email,
            password: hashedPassword
        })

        if (user) {
            createWebToken(user._id, res)
            res.status(201).json({
                success: true, message: "user succesfully created", user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            })
        }
        res.status(400).json({ success: false, message: "Invalid user Data" })

    } catch (error) {
        console.error(`Error in SignUp controller ${error}`);
        res.status(500).json({ error: 'Internal server error' })
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await userModel.findOne({ username })

        if (!user) return res.status(404).json({ success: false, message: "User not found" })

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) return res.status(400).json({ success: false, message: "Password is wrong " })

        const token = createWebToken(user._id, res)
        return res.status(200).json({ success: true, message: "Succesfull login", user: { id: user._id, username: user.username, email: user.email } })

    } catch (error) {
        console.error(`Error is Login Controller ${error}`);
        res.status(500).json({ error: 'Internal server error' })
    }
}


const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        })
        res.status(200).json({ message: "Logout successful" })
    } catch (error) {
        console.error(`Error is Logout Controller ${error}`);
        res.status(500).json({ error: 'Internal server error' })
    }
}

const getMe = async (req, res) => {
    try {
        const user = req.user
        return res.status(200).json({ success: true, user })

    } catch (error) {
        console.error(`Error in getMe Controller ${error}`);
        res.status(500).json({ error: 'Internal server error' })
    }
}

export { signUp, login, logout, getMe }