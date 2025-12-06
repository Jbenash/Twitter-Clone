import express from 'express'
import dotenv from 'dotenv'

dotenv.config({ path: './backend/.env' })

const app = express()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT, () => {
    console.log(`server is running on ${process.env.PORT}`);

})