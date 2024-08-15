const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcrypt');


const createToken = (id) => {
    return jwt.sign(
        { id }, process.env.SECRET, { expiresIn: '5d' }
    );
}

const loginUser = async (req, res) => {
    try {
        console.log('/login');
        const { email, password } = req.body;

        console.log(email, password)

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'Invalid email.' });
        }

        const passCheck = await bcrypt.compare(password, user.password);

        if (!passCheck) {
            return res.status(400).json({ error: 'Invalid password.' });
        }

        console.log('success')

        const token = createToken(user._id);

        return res.status(200).json({ message: 'Logged In', x_auth_token: token });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


const registerUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        throw Error('All fields must be filled.')
    }

    if (!validator.isEmail(email)) {
        throw Error('Invalid Email.')
    }

    // if (!validator.isStrongPassword(password)) {
    //     throw Error('Password is not a strong enough.')
    // }

    try {
        const exists = await User.findOne({ email })

        if (exists) {
            return res.status(409).json({ error: "Email already in use." })
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        await User.create({ email, password: hash, phone: null, cnicBack: null, cnicFront: null });

        return res.status(200).json({ message: 'User registered successfully.' });


    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

}


module.exports = { loginUser, registerUser }