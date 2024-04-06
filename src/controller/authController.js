const passport = require('passport');

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'], accessType: 'offline' });

exports.googleAuthCallback = passport.authenticate('google', { failureRedirect: '/' });

exports.logout = (req, res, next) => {
    req.logout(() => {
        res.redirect('/');
    });
};
