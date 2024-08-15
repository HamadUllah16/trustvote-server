require('dotenv').config();

const mongoose = require('mongoose');

async function connectDb() {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log('DB Connected')
    }
    catch (err) {
        console.log('Error in DB Connection', err)
    }
}

module.exports = connectDb;