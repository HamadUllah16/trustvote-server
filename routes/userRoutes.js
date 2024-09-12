const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, userLogout } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');


router.get('/get-user-profile', verifyToken, getUserProfile);
router.patch('/update-user-profile', verifyToken, updateUserProfile)
router.get('/logout', verifyToken, userLogout)

module.exports = router;