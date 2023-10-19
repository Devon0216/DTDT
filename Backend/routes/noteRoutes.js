const express = require('express')
const router = express.Router()
const notesController = require('../controllers/notesController')

// Route to control all notes related actions
router.route('/')
    .get(notesController.getAllNotes)
    .post(notesController.createNewNote)
    .patch(notesController.updateNote)
    .delete(notesController.deleteNote)

router.route('/workshopNotes')
    .post(notesController.getAllNotesForOneWorkshop)
    .delete(notesController.deleteNoteByWorkshop)

module.exports = router