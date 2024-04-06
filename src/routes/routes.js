const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const authController = require('../controller/authController');
const userController = require('../controller/userController');
const UIController = require('../controller/UiController')

//Home, Register && Login UI Page
router.get('/', UIController.home)
router.get('/register', UIController.register);
router.get('/login', UIController.login);

//Register && Login Action
router.post('/registerNewUser', userController.newProfile)
router.post('/userLogin', userController.loginProfile)

// OAuth routes
router.get('/auth/google', authController.googleAuth);
router.get('/auth/google/callback', authController.googleAuthCallback, (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, 'secret', { expiresIn: '1h' });
    res.redirect(`/profile?token=${token}`);
});

// Profile routes
router.get('/profile', userController.getProfile);
router.get('/updateProfile', userController.getUpdateProfile);
router.post('/updateUserProfile', userController.updateUserProfile);
router.get('/profileList', userController.getProfileList);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
