const express = require('express')
const router = express.Router()
const workshopController = require('../controllers/workshopController')

// Route to control all workshops related actions
router.route('/')
    .get(workshopController.getAllWorkshops)
    .post(workshopController.createNewWorkshop)
    .patch(workshopController.updateWorkshop)
    .delete(workshopController.deleteWorkshop)

router.route('/userworkshop')
    .post(workshopController.getUserWorkshops)
    .patch(workshopController.addAgenda)
    .delete(workshopController.deleteAgenda)

router.route('/workshopByName')
    .post(workshopController.getWorkshopByName)
    .patch(workshopController.addSummary)

router.route('/workshopById')
    .post(workshopController.getWorkshopById)


module.exports = router
