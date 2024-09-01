// routes/CandidateRoutes/completeProfileRoutes.js

const express = require('express');
const router = express.Router();
const { completeProfile } = require('../../controllers/CandidateController/profileCompletion');
const { verifyToken } = require('../../middlewares/authMiddleware');

console.log('Setting up completeProfileRoutes...');

// Complete candidate profile (protected route)
router.put('/:id', (req, res, next) => {
    console.log(`PUT /api/candidates/profile/${req.params.id} - request received`);
    next();
}, verifyToken, (req, res, next) => {
    console.log('verifyToken middleware passed');
    next();
}, completeProfile);

module.exports = router;
