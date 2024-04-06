const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./src/models/User');
const path = require('path');
require('./src/database/db');
const dotenv = require('dotenv')
dotenv.config();

// Import routes
const routes = require('./src/routes/routes');

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: process.env.OAUTH_SECRETKEY, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views'));

// Passport serialization/deserialization
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err, null);
        });
});

// Passport Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENTSECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
            user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                emailVerified: profile.emails[0].verified,
                profile: profile.photos[0].value,
                googleAccessToken: accessToken,
                googleRefreshToken: refreshToken
            });
            await user.save();
        } else {
            if (user.googleAccessToken !== accessToken) {
                user.googleAccessToken = accessToken;
                user.googleRefreshToken = refreshToken;
                await user.save();
            }
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

// Use routes
app.use('/', routes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
