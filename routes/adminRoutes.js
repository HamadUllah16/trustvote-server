// routes/AdminRoutes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { adminLogin, getPendingCandidates, approveOrRejectCandidate, adminProfile, } = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// Admin login route
router.post('/login', adminLogin);

// get admin profile
router.get('/get-admin-profile', verifyToken, adminProfile);

// Protected routes that require admin authentication
router.get('/candidates/pending', verifyToken, verifyAdmin, getPendingCandidates);
router.put('/candidates/:candidateId/approve', verifyToken, verifyAdmin, approveOrRejectCandidate);


module.exports = router;
