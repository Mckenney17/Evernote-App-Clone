const express = require('express')

const authController = require('../controllers/auth.controller')

const router = express.Router()

router.get('/session', authController.getSession)

router.get('/auth_token', authController.getAuthToken)


router.post('/login', authController.postLogin)

// router.get('/signup', authController.getSignup)

router.post('/signup', authController.postSignup)

router.post('/email_validate', authController.emailValidate)

router.post('/resend_verification', authController.resendVerification)

module.exports = router