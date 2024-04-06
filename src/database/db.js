//./src/database/bd.js
const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config();

//Database Link
const Link = process.env.MONGODB_CONNECTION_URL || "mongodb://localhost:27017/user_profiles"

// Connect to MongoDB
mongoose.connect(Link);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to DB successfully');
});

module.exports = mongoose;
