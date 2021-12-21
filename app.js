const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

const authRoutes = require('./routes/auth.route')
const appRoutes = require('./routes/app.route')

app.use(authRoutes)
app.use(appRoutes)

if(process.env.NODE_ENV === 'production'){    
    app.use(express.static('client/build'))
    app.get(' * ', (req, res) => {
        res.sendFile (path.join(__dirname, 'client', 'build', 'index.html'))
    });
}
(async () => {
    await mongoose.connect(process.env.MONGODB_URI_LOCAL, { useNewUrlParser: true, useUnifiedTopology: true })
    app.listen(5000 || process.env.PORT)
})()