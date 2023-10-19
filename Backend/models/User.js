const mongoose = require('mongoose')

// MongoDB schema for users
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    miroId: {
        type: String,
        required: true
    },
    workshops: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workshop'
    }],
})

module.exports = mongoose.model('User', userSchema)