const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const cors = require('cors')
const compression = require('compression')
require('dotenv').config()


const app = express()
app.use(compression())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'client', 'public')))
app.use(cors())

const sessionStore = new MongoDBStore({
    uri: process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI_REMOTE : process.env.MONGODB_URI_LOCAL,
    collection: 'sessions'
})


const authRoutes = require('./routes/auth.route')
const appRoutes = require('./routes/app.route')
const User = require('./models/user.model')

app.use(session({
    secret: 'lobodobo',
    saveUninitialized: false,
    resave: false,
    store: sessionStore,
}))
app.use(csrf())


app.use(async (req, res, next) => {
    try {
        if (!req.session.user) {
            return next()
        }
        const user = await User.findById(req.session.user._id)
        req.user = user
        next()
    } catch (e) {
        console.log(e)
    }
})
app.use(authRoutes)
app.use(appRoutes)
if (process.env.NODE_ENV === 'production'){    
    app.use(express.static(path.join(__dirname, 'client', 'build')))
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    });
}

(async () => {
    await mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI_REMOTE : process.env.MONGODB_URI_LOCAL, { useNewUrlParser: true, useUnifiedTopology: true })
    app.listen(process.env.PORT || 5000, () => {
        console.log('Server running')
    })
})()