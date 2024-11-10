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
const constituencyRoutes = require('./routes/constituencyRoutes');
const authRoutes = require('./routes/authRoutes')
const connectDb = require('./config/database');
const { createAdmin } = require('./controllers/adminController');
const provincialConstituencyRoutes = require('./routes/provincialConstituencyRoutes');
const electionSessionRoutes = require('./routes/electionSessionRoutes');
const multer = require('./middlewares/multer');
const { fileUpload } = require('./utils/cloudinary');

// Load environment variables from .env file
dotenv.config();

// Create an instance of Express
const app = express();

// Connect to MongoDB
connectDb().then((msg) => {
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

    app.use(express.json({ limit: '20mb' }))
    app.use(express.urlencoded({ limit: '10mb', extended: true }));

    //create default admin if not exists
    createAdmin();

    // Authentication routes
    app.use('/api/auth', authRoutes)
    // Candidate routes
    app.use('/api/candidate', candidateRoutes)
    // User routes
    app.use('/api/user', userRoutes)
    // Admin routes
    app.use('/api/admin', adminRoutes)
    // Constituency routes
    app.use('/api/constituency', constituencyRoutes)
    // Provincial Constituencies
    app.use('/api/provincial-constituencies', provincialConstituencyRoutes)
    // Election Session
    app.use('/api/election-session', electionSessionRoutes);

    app.post('/upload', multer.single('test'), async (req, res) => {
        console.log(req.body)
        try {
            if (!req.file) {
                console.error('No file attached.')
                return res.status(400).send('No file uploaded.')
            }
            const fileType = req.file.mimetype.split('/')[0];
            const cloudinaryUrl = await fileUpload(req.file.buffer, fileType);

            res.send({ url: cloudinaryUrl });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error.' })
        }
    })

    // server setup
    const PORT = process.env.PORT || 3000;

    app.listen((PORT), () => {
        console.log(`Listening to ${PORT}`)
    })

    app.get('/', (req, res) => {
        console.log('Server up!')
        res.status(200).json({ message: 'Server up', database: msg })
    })
}).catch((e) => {
    console.log(e);
    return e
})

module.exports = app;
