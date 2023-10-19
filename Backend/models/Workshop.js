
const mongoose = require('mongoose')

// MongoDB schema for workshops
const workshopSchema = new mongoose.Schema(
    {
        User: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        Note: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note'
        }],
        workshopname: {
            type: String,
            required: true
        },
        workshopAgenda: {
            type: String,
            default: ""
        },
        workshopSummary: {
            type: String,
            default: ""
        }
    }
)

module.exports = mongoose.model('Workshop', workshopSchema)