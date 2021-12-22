const User = require("../models/user.model")
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
})

exports.getSession = (req, res) => {
    res.send(req.session)
}

exports.getAuthToken = (req, res) => {
    res.json({ csrfToken: req.csrfToken() })
}

exports.postLogin = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ errorMessage: 'Incorrect Email or Password' })
        }
        if (!user.emailValidate) {
            return res.status(401).json({ errorMessage: 'Verification Error' })
        }
        const doMatch = await bcrypt.compare(password, user.password)
        if (!doMatch) {
            return res.status(401).json({ errorMessage: 'Incorrect Email or Password' })
        }
        req.session.isAuthenticated = true
        req.session.user = user
        await req.session.save()
        res.json({ user })
    } catch (e) {
        console.log(e)
    }
}

exports.postSignup = async (req, res) => {
    const { _csrf, origin, ...userData } = req.body
    const { email, password } = userData
    const userExists = await User.findOne({ email })
    if (userExists) return res.status(401).json({ errorMessage: 'Email already taken, try another.' })
    const hashedPassword = await bcrypt.hash(password, 12)
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const user = new User({ ...userData, password: hashedPassword, emailVerified: false, verificationToken })
    await user.save()
    req.session.email = email
    res.json({ successMessage: 'Account created successfully.' })
    transporter.sendMail({
        from: 'apps.mckenney@gmail.com',
        to: email,
        subject: 'Kennote App - Verify your email',
        html: `
        <h2>Kennote App - Email verification</h2>
        <p><a href='${origin}/verify_email/${verificationToken}'>Verify your email.</a></p>
        `
    })
}

exports.emailValidate = async (req, res) => {
    const { email } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) return res.status(401)
    res.status(200)
}

exports.resendVerification = async (req, res) => {
    const { email, origin } = req.body
    const verificationToken = crypto.randomBytes(32).toString('hex')
    transporter.sendMail({
        from: 'apps.mckenney@gmail.com',
        to: email,
        subject: 'Kennote App - Verify your email',
        html: `
        <h2>Kennote App - Email verification</h2>
        <p><a href='${origin}/verify_email/${verificationToken}'>Click to verify your email.</a></p>
        `
    })
    res.json({ successMessage: 'Verification Sent' })
}