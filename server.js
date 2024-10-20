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
const ProvincialConstituency = require('./models/ProvincialConstituency');

// Load environment variables from .env file
dotenv.config();

// Create an instance of Express
const app = express();

// Connect to MongoDB
connectDb()

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

const constituencies = {
    province: "Balochistan",
    constituencies: [
        { constituency: "PB-1", area: "Sherani Cum Zhob" },
        { constituency: "PB-2", area: "Zhob" },
        { constituency: "PB-3", area: "Killa Saif Ullah" },
        { constituency: "PB-4", area: "Musakhail Cum Barkhan" },
        { constituency: "PB-5", area: "Loralai" },
        { constituency: "PB-6", area: "Duki" },
        { constituency: "PB-7", area: "Ziarat" },
        { constituency: "PB-8", area: "Harnai Cum Sibi" },
        { constituency: "PB-9", area: "Kohlu" },
        { constituency: "PB-10", area: "Dera Bugti" },
        { constituency: "PB-11", area: "Jhall Magsi" },
        { constituency: "PB-12", area: "Kachhi" },
        { constituency: "PB-13", area: "Nasirabad I" },
        { constituency: "PB-14", area: "Nasirabad II" },
        { constituency: "PB-15", area: "Sohbat Pur" },
        { constituency: "PB-16", area: "Jaffarabad" },
        { constituency: "PB-17", area: "Usta Muhammad" },
        { constituency: "PB-18", area: "Khuzdar I" },
        { constituency: "PB-19", area: "Khuzdar II" },
        { constituency: "PB-20", area: "Khuzdar III" },
        { constituency: "PB-21", area: "Hub" },
        { constituency: "PB-22", area: "Lasbela" },
        { constituency: "PB-23", area: "Awaran" },
        { constituency: "PB-24", area: "Gwadar" },
        { constituency: "PB-25", area: "Kech I" },
        { constituency: "PB-26", area: "Kech II" },
        { constituency: "PB-27", area: "Kech III" },
        { constituency: "PB-28", area: "Kech IV" },
        { constituency: "PB-29", area: "Panjgur I" },
        { constituency: "PB-30", area: "Panjgur II" },
        { constituency: "PB-31", area: "Washuk" },
        { constituency: "PB-32", area: "Chagai" },
        { constituency: "PB-33", area: "Kharan" },
        { constituency: "PB-34", area: "Nushki" },
        { constituency: "PB-35", area: "Surab" },
        { constituency: "PB-36", area: "Kalat" },
        { constituency: "PB-37", area: "Mastung" },
        { constituency: "PB-38", area: "Quetta I" },
        { constituency: "PB-39", area: "Quetta II" },
        { constituency: "PB-40", area: "Quetta III" },
        { constituency: "PB-41", area: "Quetta IV" },
        { constituency: "PB-42", area: "Quetta V" },
        { constituency: "PB-43", area: "Quetta VI" },
        { constituency: "PB-44", area: "Quetta VII" },
        { constituency: "PB-45", area: "Quetta VIII" },
        { constituency: "PB-46", area: "Quetta IX" },
        { constituency: "PB-47", area: "Pishin I" },
        { constituency: "PB-48", area: "Pishin II" },
        { constituency: "PB-49", area: "Pishin III" },
        { constituency: "PB-50", area: "Killa Abdullah" },
        { constituency: "PB-51", area: "Chaman" }
    ]
}


async function addToPA() {
    await ProvincialConstituency.create(constituencies).then((constituency) => console.log(constituencies)).catch(e => console.log(e))
}
addToPA();



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

const PORT = process.env.PORT || 3000;

app.listen((PORT), () => {
    console.log(`Listening to ${PORT}`)
})

app.get('/', (req, res) => {
    console.log('Server up!')
    res.status(200).json({ message: 'Server up' })
})

module.exports = app;
