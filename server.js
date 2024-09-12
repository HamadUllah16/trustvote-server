// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const authRoutes = require('./routes/authRoutes')
const connectDb = require('./config/database');

// Load environment variables from .env file
dotenv.config();

// Create an instance of Express
const app = express();

// Connect to MongoDB
connectDb()

// Middleware setup
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));

app.use(express.json({ limit: '20mb' }))

// Authentication routes
app.use('/api/auth', authRoutes)
// Candidate routes
app.use('/api/candidate', candidateRoutes)
// User routes
app.use('/api/user', userRoutes)
// Admin routes
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3000;

app.listen((PORT), () => {
    console.log(`Listening to ${PORT}`)
})

app.get('*', (req, res) => {
    console.log('Server up!')
    res.status(200).json({ message: 'Server up' })
})

module.exports = app;
