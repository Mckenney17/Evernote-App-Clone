const express = require('express')

const authController = require('../controllers/auth.controller')

const router = express.Router()

router.get('/session', authController.getSession)

router.get('/auth_token', authController.getAuthToken)

router.post('/login', authController.postLogin)

router.post('/signup', authController.postSignup)

router.post('/email_validate', authController.emailValidate)

router.post('/resend_verification', authController.resendVerification)

// external
router.get('/verify_email/:verificationToken', authController.verifyEmail)

router.post('/request_pwd_reset', authController.requestPwdReset)

router.post('/resend_pwd_reset_confirmation', authController.resendPwdResetConfirmation)

// external
router.route('/set_new_password/:passwordResetToken')
.post(authController.setNewPassword)
.get((req, res, next) => {
    next()
})

module.exports = router