const Note = require('../models/Note')
const Workshop = require('../models/Workshop')
const asyncHandler = require('express-async-handler')

// Notes function to get all notes from MongoDB database
const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean()

    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' })
    }

    const notesWithWorkshop = await Promise.all(notes.map(async (note) => {
        const workshop = await Workshop.findById(note.workshop).lean().exec()
        return { ...note, workshopname: workshop.workshopname }
    }))

    res.json(notesWithWorkshop)
})

// Notes function to get all notes for one specific workshop from MongoDB database, given the workshop
const getAllNotesForOneWorkshop = asyncHandler(async (req, res) => {
    const { workshop } = req.body
    const notes = await Note.find({ workshop: `${workshop}` }).lean().exec()

    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' })
    }

    res.json(notes)
})

// Notes function to create a new note for a workshop in MongoDB database, given workshop and the note content
const createNewNote = asyncHandler(async (req, res) => {
    const { workshop, content } = req.body

    if (!workshop || !content) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const note = await Note.create({ workshop, content })

    if (note) {
        return res.status(201).json(note)
    } else {
        return res.status(400).json({ message: 'Invalid note data received' })
    }

})

// Notes function to update a note in MongoDB database, given the note id, workshop, and new note content
const updateNote = asyncHandler(async (req, res) => {
    const { id, workshop, content } = req.body

    if (!id || !workshop || !content ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    note.workshop = workshop
    note.content = content
    const updatedNote = await note.save()

    res.json(`'${updatedNote.content}' updated`)
})

// Notes function to delete a note in MongoDB database, given the note id
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Note ID required' })
    }

    const note = await Note.findById(id).exec()
    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    const result = await note.deleteOne()
    const reply = `Note '${result.title}' with ID ${result._id} deleted`
    res.json(reply)
})

// Notes function to delete all notes for a workshop in MongoDB database, given the workshop id
const deleteNoteByWorkshop = asyncHandler(async (req, res) => {
    const { workshop } = req.body

    if (!workshop) {
        return res.status(400).json({ message: 'Note workshop id required' })
    }

    const note = await Note.find({ workshop: `${workshop}` }).lean().exec()
    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    const result = await Note.deleteMany({ workshop: `${workshop}` })
    res.json(result)
})

module.exports = {
    getAllNotes,
    getAllNotesForOneWorkshop,
    createNewNote,
    updateNote,
    deleteNote,
    deleteNoteByWorkshop
}