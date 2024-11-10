// config/database.js
require('dotenv').config();
const mongoose = require('mongoose');

async function connectDb() {
    console.log('trying to connect db');
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('DB Connected');
        return 'DB Connected';
    } catch (err) {
        console.error('Error in DB Connection:', err);
        throw err;
    }
}

module.exports = connectDb;
