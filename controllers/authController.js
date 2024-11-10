const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcrypt');
const Candidate = require('../models/Candidate');
const Admin = require('../models/Admin');


const createToken = (id, role) => {
    return jwt.sign(
        { id, role }, process.env.JWT_SECRET, { expiresIn: '5d' }
    );
}

const loginUser = async (req, res) => {
    try {
        console.log('/login');
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email.' });
        }

        const passCheck = await bcrypt.compare(password, user.password);

        if (!passCheck) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        console.log('success')

        const token = createToken(user._id, user.role);

        return res.status(200).json({ message: 'Logged In', x_auth_token: token, role: 'voter' });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
const loginUserEmailCheck = async (req, res) => {
    try {
        console.log('/login/email-check');
        const { email, role } = req.body;
        console.log(email);

        if (role === 'voter') {

            const exists = await User.findOne({ email });
            if (!exists) {
                return res.status(400).json({ message: 'Email does not exist.', exists: false });
            }
            // Only reach here if the email exists
            return res.status(200).json({ message: 'Email exists', exists: true });
        }

        if (role === 'candidate') {

            const exists = await Candidate.findOne({ email });
            if (!exists) {
                return res.status(400).json({ message: 'Email does not exist.', exists: false });
            }
            // Only reach here if the email exists
            return res.status(200).json({ message: 'Email exists', exists: true });
        }

        if (role === 'admin') {

            const exists = await Admin.findOne({ email });
            if (!exists) {
                return res.status(400).json({ message: 'Email does not exist.', exists: false });
            }
            // Only reach here if the email exists
            return res.status(200).json({ message: 'Email exists', exists: true });
        }

    } catch (error) {
        console.error(error); // Helpful for debugging server errors
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};


const registerUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        throw Error('All fields must be filled.')
    }

    if (!validator.isEmail(email)) {
        throw Error('Invalid Email - Validator.')
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

        await User.create({ role: 'voter', profilePicture: '', email, password: hash, phone: null, cnicBack: null, cnicFront: null, naVote: true, paVote: true });

        return res.status(200).json({ message: 'User registered successfully.' });


    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

}


module.exports = { loginUser, registerUser, loginUserEmailCheck }