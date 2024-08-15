const express = require('express');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const connectDb = require('./config/database');
const cors = require('cors')

require('dotenv').config();
const app = express();
app.use(cors({ origin: '*' }))

connectDb();

//body-parser
app.use(express.json());


// authRoutes
app.use('/api/auth', authRoutes)

//userRoutes middleware
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Server Live" })
})

app.listen(process.env.PORT, (req, res) => {
    console.log(`Listening to ${process.env.PORT}`)
})
