const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')

// Users function to get all users from MongoDB database
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().lean().exec()

    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
})

// Users function to get one user from MongoDB database, given the username and Miro ID
const getOneUser = asyncHandler(async (req, res) => {
    const { username, miroId } = req.body

    if (!username || !miroId ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const user = await User.find({ username: `${username}`, miroId: `${miroId}` }).lean().exec()
    if (!user?.length) {
        return res.status(400).json({ message: 'No user found' })
    }

    res.json(user)
})

// Users function to get one user by Miro ID from MongoDB database, given the Miro ID
const getUserByMiroId = asyncHandler(async (req, res) => {
    const { miroId } = req.body

    if (!miroId  ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const user = await User.find({ miroId: `${miroId}` }).lean().exec()
    if (!user?.length) {
        return res.status(400).json({ message: 'No user found' })
    }

    res.json(user)
})

// Users function to create a new user in MongoDB database, given the username and Miro ID
const createNewUser = asyncHandler(async (req, res) => {
    const { username, miroId } = req.body

    if (!username || !miroId ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const duplicate = await User.findOne({ miroId }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate miro Id' })
    }

    const userObject = { username, "miroId": miroId }
    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({ message: `New user ${username} with miro Id ${miroId} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// Users function to update a user in MongoDB database, given the user id, username, Miro ID and the user's workshops
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, miroId, workshops } = req.body

    if (!id || !username ) {
        return res.status(400).json({ message: 'All fields except miroId are required' })
    }

    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = username
    if (miroId) {
        user.miroId = miroId
    }
    if (workshops) {
        user.workshops = workshops
    }

    const updatedUser = await user.save()
    res.json({ message: `${updatedUser.username} updated` })
})

// Users function to delete a user in MongoDB database, given the user id
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' })
    }

    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()
    const reply = `Username ${result.username} with ID ${result._id} deleted`
    res.json(reply)
})

module.exports = {
    getAllUsers,
    getOneUser,
    getUserByMiroId,
    createNewUser,
    updateUser,
    deleteUser
}