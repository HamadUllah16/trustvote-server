const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, userLogout, castAVote, registeredUsersCount } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { allPoliticalParties } = require('../controllers/politicalPartyController');
const multer = require('../middlewares/multer');
const { myCandidates } = require('../controllers/candidateController');


router.get('/get-user-profile', verifyToken, getUserProfile);
router.put('/update-user-profile', verifyToken, multer.fields([
    { name: 'cnicFront' },
    { name: 'cnicBack' },
    { name: 'profilePicture' }
]), updateUserProfile)

router.get('/logout', verifyToken, userLogout)

router.get('/all-political-parties', verifyToken, allPoliticalParties);
router.get('/my-candidates', verifyToken, myCandidates)

// user vote blockchain
router.post('/cast-a-vote', verifyToken, castAVote);

// voters count
router.get('/get-verified-users-count', registeredUsersCount)

module.exports = router;