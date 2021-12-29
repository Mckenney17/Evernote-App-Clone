const express = require('express')

const appController = require('../controllers/app.controller')

const router = express.Router()

router.get('/get_notes/:category', appController.getNotes)

router.post('/add_new_note/:notebook', appController.addNewNote)

module.exports = router