const mongoose = require('mongoose')

// MongoDB connection using the given MongdoDB database URI
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI)
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB