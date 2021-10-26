const express = require('express')
const mongoose = require('mongoose')

const authRouter = require('./authRouter')

const PORT = process.env.PORT || 7000

const app = express()
app.use(express.json())
app.use('/auth',authRouter)

const start = async ()=>{
    try {
        await mongoose.connect(`mongodb+srv://auth:auth@cluster0.lxvwc.mongodb.net/authStore?retryWrites=true&w=majority`,
        {useUnifiedTopology:true,
            useNewUrlParser:true})
        app.listen(PORT, ()=>console.log(`server working on port ${PORT}  `))
    } catch (e) {
        console.log(e)
    }
}

start()