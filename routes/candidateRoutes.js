const { getPendingCandidates, getApprovedCandidates } = require('../controllers/adminController');
const { getCandidateProfile, completeCandidateProfile, getAllCandidates } = require('../controllers/candidateController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = require('express').Router();

router.put('/update-profile', verifyToken, completeCandidateProfile)
router.get('/get-candidate-profile', verifyToken, getCandidateProfile)
router.get('/all-candidates', verifyToken, getAllCandidates)
router.get('/pending-candidates', verifyToken, getPendingCandidates);
router.get('/approved-candidates', verifyToken, getApprovedCandidates)

module.exports = router;