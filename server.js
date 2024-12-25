// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const { createServer } = require('http'); // Import HTTP server creation
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const constituencyRoutes = require('./routes/constituencyRoutes');
const authRoutes = require('./routes/authRoutes');
const connectDb = require('./config/database');
const { createAdmin } = require('./controllers/adminController');
const provincialConstituencyRoutes = require('./routes/provincialConstituencyRoutes');
const electionSessionRoutes = require('./routes/electionSessionRoutes');
const multer = require('./middlewares/multer');
const { fileUpload } = require('./utils/cloudinary');
const { initializeSocket } = require('./config/socket'); // Import Socket.IO initialization

dotenv.config();

const app = express();

// Create HTTP server instance
const httpServer = createServer(app);

// Initialize Socket.IO with the HTTP server
initializeSocket(httpServer);

let dbConnection = connectDb();

// Middleware setup
app.use(express.json());
app.use(morgan('dev'));
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:3001'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Create default admin if not exists
createAdmin();

// Authentication routes
app.use('/api/auth', authRoutes);
// Candidate routes
app.use('/api/candidate', candidateRoutes);
// User routes
app.use('/api/user', userRoutes);
// Admin routes
app.use('/api/admin', adminRoutes);
// Constituency routes
app.use('/api/constituency', constituencyRoutes);
// Provincial Constituencies
app.use('/api/provincial-constituencies', provincialConstituencyRoutes);
// Election Session
app.use('/api/election-session', electionSessionRoutes);

// Root route
app.get('/', (req, res) => {
    console.log('Server up!');
    res.status(200).json({ message: 'Server up', dbConnection });
});

// Start the server
const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

module.exports = app;
