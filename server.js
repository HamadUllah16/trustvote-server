// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');


// Candidate-related routes
const candidateRegisterRoutes = require('./routes/CandidateRoutes/registerCandidate');
const candidateProfileRoutes = require('./routes/CandidateRoutes/profileCompletion');
const returnCandidateRoutes = require('./routes/CandidateRoutes/returnCandidate');
const loginCandidateRoutes = require('./routes/CandidateRoutes/loginCandidate');
const adminRoutes = require('./routes/AdminRoutes/adminRoutes');

// Load environment variables from .env file
dotenv.config();

// Create an instance of Express
const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Candidate routes
app.use('/api/candidates/register', (req, res, next) => {
    console.log('Received request at /api/candidates/register');
    next();
}, candidateRegisterRoutes);

app.use('/api/candidates/profile', (req, res, next) => {
    console.log('Received request at /api/candidates/profile');
    next();
}, candidateProfileRoutes);

app.use('/api/candidates/get', (req, res, next) => {
    console.log('Received request at /api/candidates/get');
    next();
}, returnCandidateRoutes);

app.use('/api/candidate/login', (req, res, next) => {
    console.log('Received request at /api/candidate/login');
    next();
}, loginCandidateRoutes);

app.use('/api/admin',(req, res, next)=>{
    console.log('Received request at /api/admin');
    next();
}, adminRoutes);

// Connect to MongoDB
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });

module.exports = app;
