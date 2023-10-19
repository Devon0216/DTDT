const Workshop = require('../models/Workshop')
const asyncHandler = require('express-async-handler')

// Workshop function to get all workshops from MongoDB
const getAllWorkshops = asyncHandler(async (req, res) => {
    const workshops = await Workshop.find().lean()

    if (!workshops?.length) {
        return res.status(400).json({ message: 'No workshops found' })
    }

    res.json(workshops)
})

// Workshop function to get all workshops for one specific user from MongoDB database, given the user ID
const getUserWorkshops = asyncHandler(async (req, res) => {
    const { userid } = req.body

    if (!userid ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const workshops = await Workshop.find({ User: `${userid}` }).lean().exec()
    if (!workshops?.length) {
        return res.status(400).json({ message: 'No workshops found' })
    }

    res.json(workshops)
})

// Workshop function to get a specific workshop from MongoDB database, given the workshop name
const getWorkshopByName = asyncHandler(async (req, res) => {
    const { workshopname } = req.body

    if (!workshopname ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const workshops = await Workshop.find({ workshopname: `${workshopname}` }).lean().exec()
    if (!workshops?.length) {
        return res.status(400).json({ message: 'No workshops found' })
    }

    res.json(workshops)
})


// Workshop function to get a specific workshop from MongoDB database, given the workshop ID
const getWorkshopById = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const workshop = await Workshop.findById(id).exec()
    if (!workshop) {
        return res.status(400).json({ message: 'No workshops found' })
    }

    res.json(workshop)
})

// Workshop function to create a new workshop in MongoDB database, given the user ID and workshop name, and maybe the notes
const createNewWorkshop = asyncHandler(async (req, res) => {
    const { User, Note, workshopname } = req.body

    if (!User || !workshopname ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const duplicate = await Workshop.findOne({ workshopname }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate workshopname' })
    }
 
    const workshop = await Workshop.create({ User, workshopname })
    if (workshop) {
        return res.status(201).json({ message: 'New workshop created' })
    } else {
        return res.status(400).json({ message: 'Invalid workshop data received' })
    }
})

// Workshop function to update a workshop in MongoDB database, given the workshop ID, user ID, the notes and the workshopname
const updateWorkshop = asyncHandler(async (req, res) => {
    const { id, User, Note, workshopname } = req.body

    if (!id || !Array.isArray(Note) ) {
        return res.status(400).json({ message: 'ID is required' })
    }

    const workshop = await Workshop.findById(id).exec()
    if (!workshop) {
        return res.status(400).json({ message: 'Workshop not found' })
    }
    if (Note){
        workshop.Note = Note
    }

    const updatedWorkshop = await workshop.save()
    res.json(`'${updatedWorkshop.workshopname}' updated`)
})

// Workshop function to add an agenda to a workshop in MongoDB database, given the workshop ID and the agenda
const addAgenda = asyncHandler(async (req, res) => {
    const { id,  workshopAgenda } = req.body

    if (!id  ) {
        return res.status(400).json({ message: 'ID is required' })
    }

    const workshop = await Workshop.findById(id).exec()
    if (!workshop) {
        return res.status(400).json({ message: 'Workshop not found' })
    }
    if (workshopAgenda){
        workshop.workshopAgenda = workshopAgenda
    }

    const updatedWorkshop = await workshop.save()
    res.json(`'${updatedWorkshop.workshopname}' updated`)
})

// Workshop function to add a summary to a workshop in MongoDB database, given the workshop ID and the summary
const addSummary = asyncHandler(async (req, res) => {
    const { id,  workshopSummary } = req.body

    if (!id ) {
        return res.status(400).json({ message: 'ID is required' })
    }

    const workshop = await Workshop.findById(id).exec()
    if (!workshop) {
        return res.status(400).json({ message: 'Workshop not found' })
    }
    workshop.workshopSummary = workshopSummary
    const updatedWorkshop = await workshop.save()
    res.json(`'${updatedWorkshop.workshopname}' updated`)
})

// Workshop function to delete a workshop in MongoDB database, given the workshop ID
const deleteWorkshop = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Workshop ID required' })
    }

    const workshop = await Workshop.findById(id).exec()
    if (!workshop) {
        return res.status(400).json({ message: 'Workshop not found' })
    }

    const result = await workshop.deleteOne()
    const reply = `Workshop '${result.workshopname}'  deleted`
    res.json(reply)
})

// Workshop function to delete an agenda from a workshop in MongoDB database, given the workshop ID
const deleteAgenda = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'workshop ID required' })
    }

    const workshop = await Workshop.findById(id).exec()
    if (!workshop) {
        return res.status(400).json({ message: 'Workshop not found' })
    }

    workshop.workshopAgenda = ""
    await workshop.save();
    res.json(workshop)
})

module.exports = {
    getAllWorkshops,
    getUserWorkshops,
    getWorkshopByName,
    getWorkshopById,
    createNewWorkshop,
    updateWorkshop,
    addAgenda,
    addSummary,
    deleteWorkshop,
    deleteAgenda
}