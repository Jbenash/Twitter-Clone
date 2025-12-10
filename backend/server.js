import express from 'express'
import dotenv from 'dotenv'
import userRouter from './routes/auth.route.js'
import connectDB from './config/connectDb.js'
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', userRouter)



app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
    connectDB()

})