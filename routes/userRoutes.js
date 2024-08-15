const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, userLogout } = require('../controllers/userController');
const { isAuthenticated } = require('../middlewares/authMiddleware');


router.get('/get-user-profile', isAuthenticated, getUserProfile);
router.patch('/update-user-profile', isAuthenticated, updateUserProfile)
router.get('/logout', isAuthenticated, userLogout)

module.exports = router;