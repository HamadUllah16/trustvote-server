// routes/AdminRoutes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { adminLogin, getPendingCandidates, approveOrRejectCandidate, adminProfile, } = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');
const { createPoliticalParty, allPoliticalParties } = require('../controllers/politicalPartyController');

// Admin login route
router.post('/login', adminLogin);

// get admin profile
router.get('/get-admin-profile', verifyToken, adminProfile);

// Protected routes that require admin authentication
router.get('/candidates/pending', verifyToken, verifyAdmin, getPendingCandidates);
router.put('/candidates/approve-or-reject-candidate/:candidateId', verifyToken, verifyAdmin, approveOrRejectCandidate);

// create political party
router.post('/create-political-party', verifyToken, verifyAdmin, createPoliticalParty);
router.get('/all-political-parties', verifyToken, verifyAdmin, allPoliticalParties);

module.exports = router;
