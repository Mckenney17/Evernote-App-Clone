const User = require("../models/user.model")
const bcrypt = require('bcryptjs')

exports.sessionCheck = (req, res) => {
    res.send(req.session)
}

exports.getLogin = (req, res) => {
    res.send(req.csrfToken())
}

exports.postLogin = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = User.findOne({ email })
        if (!user) {
            return res.status(401).json({ errorMessage: 'Incorrect Email or Password' })
        }
        const doMatch = await bcrypt.compare(password, user.password)
        if (!doMatch) {
            return res.status(401).json({ errorMessage: 'Incorrect Email or Password' })
        }
        req.session.isAuthenticated = true
        req.session.user = user
        await req.session.save()
        res.json({ userId: user._id })
    } catch (e) {
        console.log(e)
    }
}
