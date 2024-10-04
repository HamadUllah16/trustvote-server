const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, userLogout } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { allPoliticalParties } = require('../controllers/politicalPartyController');
const multer = require('../middlewares/multer');


router.get('/get-user-profile', verifyToken, getUserProfile);
router.put('/update-user-profile', verifyToken, multer.fields([
    { name: 'cnicFront' },
    { name: 'cnicBack' }
]), updateUserProfile)
router.get('/logout', verifyToken, userLogout)

router.get('/all-political-parties', verifyToken, allPoliticalParties);

module.exports = router;