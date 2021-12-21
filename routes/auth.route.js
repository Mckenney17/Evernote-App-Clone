const express = require('express')

const authController = require('../controllers/auth.controller')

const router = express.Router()

router.get('/session_check', authController.sessionCheck)

router.post('/login', authController.postLogin)

module.exports = router