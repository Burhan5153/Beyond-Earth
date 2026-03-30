const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/land', require('./routes/land'));
app.use('/api/content', require('./routes/content'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/beyond-earth';
console.log('Connecting to MongoDB:', mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide password
mongoose.connect(mongoURI)
.then(() => {
  console.log('MongoDB Connected');
  console.log('Database name:', mongoose.connection.db.databaseName);
})
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

