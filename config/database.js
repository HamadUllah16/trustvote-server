require('dotenv').config();

const mongoose = require('mongoose');

async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('DB Connected')
        return 'DB Connected'
    }
    catch (err) {
        console.error('Error in DB Connection', err)
        return err
    }
}

module.exports = connectDb;
