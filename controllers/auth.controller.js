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
        const doMatch = await bcrypt.compare(password, user.password)
        if (!doMatch) {
            return res.status(401).json({ errorMessage: 'Incorrect Email or Password' })
        }
        if (!user.emailVerified) {
            return res.status(401).json({ errorMessage: 'Verification Error' })
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
    try {
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
        }, (err) => {
            
        })
    } catch (e) {
        console.log(e)
    }
}

exports.emailValidate = async (req, res) => {
    try {
        const { email } = req.body
        const userExists = await User.findOne({ email })
        if (userExists) return res.status(401).json({ errorMessage: 'Email already taken.' })
        res.status(200).json({ successMessage: 'OK' })
    } catch (e) {
        console.log(e)
    }
}

exports.resendVerification = async (req, res) => {
    try {
        const { email, origin } = req.body
        const verificationToken = crypto.randomBytes(32).toString('hex')
        const user = await User.findOne({ email })
        user.verificationToken = verificationToken
        await user.save()
        transporter.sendMail({
            from: 'apps.mckenney@gmail.com',
            to: email,
            subject: 'Kennote App - Verify your email',
            html: `
            <h2>Kennote App - Email verification</h2>
            <p><a href='${origin}/verify_email/${verificationToken}'>Click to verify your email.</a></p>
            `
        }, (err) => {
            if (err) res.status(404).json({ errorMessage: 'Request Failed. Check your internet connection.' })
            else res.json({ successMessage: 'Verification Link Sent' })
        })
    } catch (e) {
        console.log(e)
    }
}

exports.verifyEmail = async (req, res) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ verificationToken })
        if (!user) return res.status(401).json({ errorMessage: 'Verification Failed' })
        user.emailVerified = true
        user.verificationToken = undefined
        await user.save()
        req.session.email = undefined
        await req.session.save()
        res.json({ successMessage: 'Verification Successful' })
    } catch (e) {
        console.log(e)
    }
}