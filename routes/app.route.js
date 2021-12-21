const express = require('express')

const appController = require('../controllers/app.controller')

const router = express.Router()

router.get('/notes', appController.getNotes)

module.exports = router