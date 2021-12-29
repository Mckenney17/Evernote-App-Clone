const User = require("../models/user.model")
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const Notebook = require("../models/notebook.model")

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

exports.verifyEmail = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ email: req.session.email_to_verify, verificationToken })
        if (!user) return res.status(401).json({ errorMessage: 'Verification Failed' })
        await user.updateUser({ emailVerified: true, verificationToken: undefined })
        req.session.email_to_verify = undefined
        await req.session.save()
        transporter.sendMail({
            from: 'apps.mckenney@gmail.com',
            to: email,
            subject: 'Kennote App - Verification successful',
            html: `
            <h2>Kennote App - Verification Successful</h2>
            <p>${user.fullName}, your email has been successfully verified. Enjoy the App.</p>
            `
        }, (err) => {
            
        })
        if (process.env.NODE_ENV === 'production') {
            return next()
        }
        res.json({ successMessage: 'Verification Successful' })
    } catch (e) {
        console.log(e)
    }
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
            req.session.email_to_verify = email
            await req.session.save()
            return res.status(401).json({ errorMessage: 'Verification Error' })
        }
        req.session.isAuthenticated = true
        req.session.user = user
        await req.session.save()
        const notebook = await Notebook.find()
        if (!notebook.length) {
            await new Notebook({ name: 'firstNotebook', notes: [], notesQuantity: 0, ownerId: user._id }).save()
        }
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
        req.session.email_to_verify = email
        await req.session.save()
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
        await user.updateUser({ verificationToken })
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

exports.requestPwdReset = async (req, res) => {
    try {
        const { origin, email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ errorMessage: 'Incorrect Email or Password' })
        }
        const passwordResetToken = crypto.randomBytes(32).toString('hex')
        const passwordResetTokenExpires = Date.now() + (1 * 60 * 60 * 1000); // one hour
        await user.updateUser({ passwordResetToken, passwordResetTokenExpires })
        req.session.pwd_reset_email = email
        req.session.save()
        res.json({ successMessage: 'Password Reset Requested' })
        transporter.sendMail({
            from: 'apps.mckenney@gmail.com',
            to: email,
            subject: 'Kennote App - Change your Password',
            html: `
            <h2>Kennote App - Password Reset Confirmation</h2>
            <p>${user.fullName}</p>
            <p><a href='${origin}/new_password/${passwordResetToken}'>Confirm password reset</a></p>
            `
        }, (err) => {
            
        })
    } catch (e) {
        console.log(e)
    }
}

exports.resendPwdResetConfirmation = async (req, res) => {
    try {
        const { origin, email } = req.body
        const user = await User.findOne({ email })
        const passwordResetToken = crypto.randomBytes(32).toString('hex')
        const passwordResetTokenExpires = Date.now() + (1 * 60 * 60 * 1000); // one hour
        await user.updateUser({ passwordResetToken, passwordResetTokenExpires })
        transporter.sendMail({
            from: 'apps.mckenney@gmail.com',
            to: email,
            subject: 'Kennote App - Change your Password',
            html: `
            <h2>Kennote App - Password Reset Confirmation</h2>
            <p>${user.fullName}</p>
            <p><a href='${origin}/new_password/${passwordResetToken}'>Confirm password reset</a></p>
            `
        }, (err) => {
            if (err) res.status(404).json({ errorMessage: 'Request Failed. Check your internet connection.' })
            else res.json({ successMessage: 'Password Reset Requested' })
        })
    } catch (e) {
        console.log(e)
    }
}

exports.setNewPassword = async (req, res) => {
    try {
        const { passwordResetToken } = req.params
        const { newPassword } = req.body
        const user = User.findOne({ email: req.session.pwd_reset_email, passwordResetToken, passwordResetTokenExpires: { $gt: Date.now() } })
        if (!user) return res.status(401).json({ errorMessage: 'Something went wrong. Please try again.' })
        const hashedPassword = await bcrypt.hash(newPassword, 12)
        await user.updateUser({ password: hashedPassword, passwordResetToken: undefined, passwordResetTokenExpires: undefined })
        req.session.pwd_reset_email = undefined
        await req.session.save()
        transporter.sendMail({
            from: 'apps.mckenney@gmail.com',
            to: email,
            subject: 'Kennote App - Password Change Successful',
            html: `
            <h2>Kennote App - Password Changed Successfully</h2>
            <p>${user.fullName}</p>
            <p>Your password has been changed. Try logging in with the new password.</p>
            `
        }, (err) => {
            
        })
    } catch (e) {
        console.log(e)
    }
}