const express = require('express')
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/authController');
const { registerCandidate, loginCandidate } = require('../controllers/candidateController');

router.post('/login', loginUser);
router.post('/login-candidate', loginCandidate)
router.post('/register', registerUser);
router.post('/register-candidate', registerCandidate)

module.exports = router;