import userModel from "../model/user.model.js"
import jwt from 'jsonwebtoken'

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) return res.status(401).json({ message: "Token not provided" })

        let decode
        try {

            decode = jwt.verify(token, process.env.JWT_SECRET_KEY)

        } catch (error) {
            return res.status(401).json({ success: false, message: "Invalid or expired token" });

        }

        const user = await userModel.findOne({ _id: decode.userId }).select("-password")
        if (!user) return res.status(401).json({ message: "User data not found" })
        req.user = user
        next()

    } catch (error) {
        console.error(`Error is getMe Controller ${error}`);
        res.status(500).json({ error: 'Internal server error...' })
    }
}

export default auth