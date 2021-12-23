const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const cors = require('cors')
const dotenv = require('dotenv')
const compression = require('compression')

app.use(compression())

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())

const sessionStore = new MongoDBStore({
    uri: process.env.MONGODB_URI_REMOTE,
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

app.use(appRoutes)
app.use(authRoutes)
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

if(process.env.NODE_ENV === 'production'){    
    app.use(express.static('client/build'))
    app.get(' * ', (req, res) => {
        res.sendFile (path.join(__dirname, 'client', 'build', 'index.html'))
    });
}
(async () => {
    await mongoose.connect(process.env.MONGODB_URI_REMOTE, { useNewUrlParser: true, useUnifiedTopology: true })
    app.listen(5000 || process.env.PORT, () => {
        console.log('Server running')
    })
})()