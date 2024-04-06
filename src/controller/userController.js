const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

exports.getProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.render('noAuth')
        }

        const user = req.user;

        if (!user.googleAccessToken) {
            return res.status(401).send({ message: 'Google access token not found' });
        }
        const updatedUser = await User.findOne({ email: user.email });
        res.render('profile', { user: updatedUser });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.getUpdateProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.render('noAuth')
        }
        const user = req.user;
        if (!user.googleAccessToken) {
            return res.status(401).send({ message: 'Google access token not found' });
        }
        res.render('profileUpdate', { user: req.user });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const { name, email, profileLink, userType } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        if (user) {
            user.name = name || user.name;
            user.profile = profileLink || user.profile;
            user.isPublic = userType === 'public';
            await user.save();
            res.redirect('/profile');
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.getProfileList = async (req, res) => {
    try {
        const email = req.user.email;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        let users;
        if (user.isPublic) {
            users = await User.find({ isPublic: true });
        } else {
            users = await User.find();
        }

        res.render('userProfiles', { users });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.newProfile = async (req, res) => {
    try {
        const { name, email, role, userType, imageUrl, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const googleAccessToken = crypto.randomBytes(32).toString('hex');
        const googleRefreshToken = crypto.randomBytes(32).toString('hex');


        const newUser = new User({
            name,
            email,
            role,
            isPublic: userType === 'true',
            profile: imageUrl,
            googleAccessToken,
            googleRefreshToken,
            password: hashedPassword
        });

        await newUser.save();

        res.render('login');

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


exports.loginProfile = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }

        res.render('profile', { user });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


