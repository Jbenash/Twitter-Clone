import express from 'express'
import dotenv from 'dotenv'
import userRouter from './routes/auth.route.js'
import { connect } from 'mongoose'
import connectDB from './config/connectDb.js'

dotenv.config()
const PORT = process.env.PORT || 3000

const app = express()

app.use('api/auth', userRouter)

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
    connectDB()

})