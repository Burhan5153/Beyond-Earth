const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

mongoose.set('bufferCommands', false);

const app = express();

const allowedOrigins = [
  'https://beyond-earth-three.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ DB connection middleware MUST be before routes
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
  console.log('MongoDB Connected');
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    res.status(503).json({ 
      message: 'Database connection failed. Please try again.' 
    });
  }
});

// ✅ Routes AFTER the DB middleware
app.use('/api/auth', require('../routes/auth'));
app.use('/api/bookings', require('../routes/bookings'));
app.use('/api/activities', require('../routes/activities'));
app.use('/api/subscriptions', require('../routes/subscriptions'));
app.use('/api/land', require('../routes/land'));
app.use('/api/content', require('../routes/content'));
app.use('/api/contact', require('../routes/contact'));
app.use('/api/admin', require('../routes/admin'));

module.exports = app;
