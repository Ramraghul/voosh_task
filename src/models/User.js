const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    emailVerified: Boolean,
    profile: String,
    isPublic: { type: Boolean, default: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    googleAccessToken: String,
    googleRefreshToken: String,
    password:String
});

module.exports = mongoose.model('User', userSchema);
