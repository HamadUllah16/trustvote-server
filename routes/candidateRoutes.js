const { getPendingCandidates, getApprovedCandidates } = require('../controllers/adminController');
const { getCandidateProfile, completeCandidateProfile, getAllCandidates, myCandidates, myProvincialCandidates } = require('../controllers/candidateController');
const { verifyToken } = require('../middlewares/authMiddleware');
const multer = require('../middlewares/multer');

const router = require('express').Router();

router.put('/update-profile',
    verifyToken,
    multer.fields([
        { name: 'manifesto' },
        { name: 'cnicFront' },
        { name: 'cnicBack' },
        { name: 'educationalCertificates' },
        { name: 'assetDeclaration' }
    ]),
    completeCandidateProfile)
router.get('/get-candidate-profile', verifyToken, getCandidateProfile)
router.get('/all-candidates', verifyToken, getAllCandidates)
router.get('/pending-candidates', verifyToken, getPendingCandidates);
router.get('/approved-candidates', verifyToken, getApprovedCandidates)

router.get('/my-candidates', verifyToken, myCandidates);

// provincial candidates relevent to user
router.get('/my-provincial-candidates', verifyToken, myProvincialCandidates)

module.exports = router;