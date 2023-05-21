const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const UserRouter = require('./routes/UserRoute')


//DB
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log('DB connected')
})
.catch((err) => {
    console.log(err)
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }));



app.use('/user', UserRouter)




const port = 5000
app.listen(port, () => {
    console.log(`Sever is running on port ${port}`)
})