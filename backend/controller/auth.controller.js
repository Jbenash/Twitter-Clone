import userModel from "../model/user.model.js";
import validator from 'validator'
import bcrypt from 'bcryptjs'

const signUp = async (req, res) => {
    try {
        const { username, fullname, email, password } = req.body

        if (!validator.isEmail(email)) {
            return res.status(404).json({ success: false, message: "Email is not valid" })

        }

        const existEmail = await userModel.findOne({ email })
        const existUsername = await userModel.findOne({ username })


        if (existEmail || existUsername) {
            return res.status(400).json({ success: false, message: "User already registered" })
        }

        if (password.length < 6) {

            return res.status(400).json({ success: false, message: "Password should be more than 6 char " })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        const user = await userModel.create({
            fullname,
            username,
            email,
            password: hashedPassword
        })

        if (user) {
            res.status(201).json({
                success: true, message: "user succesfully created", user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            })
        } else {
            res.status(400).json({ success: false, message: "Invalid user Data" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' })
    }
}

const login = async (req, res) => {
    try {
        // code here
    } catch (error) {
        console.error(error);
    }
}


const logout = async (req, res) => {
    try {
        // code here
    } catch (error) {
        console.error(error);
    }
}
export { signUp, login, logout }