const express = require('express')
const router = express.Router()
const miroController = require('../controllers/miroController')

// Route to redirect to Miro Authorization page
router.route('/')
    .get(miroController.redirectToMiro)

module.exports = router