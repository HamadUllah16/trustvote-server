// routes/AdminRoutes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { adminLogin, getPendingCandidates, approveOrRejectCandidate, adminProfile, } = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');
const { createPoliticalParty, allPoliticalParties, deletePoliticalParty } = require('../controllers/politicalPartyController');
const Admin = require('../models/Admin');
const multer = require('../middlewares/multer');


// Admin login route
router.post('/login', adminLogin);

// get admin profile
router.get('/get-admin-profile', verifyToken, adminProfile);

// Protected routes that require admin authentication
router.get('/candidates/pending', verifyToken, verifyAdmin, getPendingCandidates);
router.put('/candidates/approve-or-reject-candidate/:candidateId', verifyToken, verifyAdmin, approveOrRejectCandidate);

// create political party
router.post('/create-political-party', verifyToken, verifyAdmin, multer.fields([{ name: 'symbol' }]), createPoliticalParty);
router.get('/all-political-parties', verifyToken, allPoliticalParties);
router.post('/delete-political-party', verifyToken, verifyAdmin, deletePoliticalParty)

module.exports = router;
