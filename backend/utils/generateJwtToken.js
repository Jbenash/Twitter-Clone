import jwt from 'jsonwebtoken'

const createWebToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })

    res.cookie("token", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true, //xss attack 
        sameSite: "strict", //csrf attack
        secure: process.env.NODE_ENV === 'production'
    })

    return token
}




export default createWebToken