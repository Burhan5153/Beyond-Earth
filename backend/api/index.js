const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/bookings', require('../routes/bookings'));
app.use('/api/activities', require('../routes/activities'));
app.use('/api/subscriptions', require('../routes/subscriptions'));
app.use('/api/land', require('../routes/land'));
app.use('/api/content', require('../routes/content'));
app.use('/api/contact', require('../routes/contact'));
app.use('/api/admin', require('../routes/admin'));

// MongoDB connection (prevents multiple connections in serverless)
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 30000,
  });
  isConnected = true;
  console.log('MongoDB Connected');
}

// Connect DB before every request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

module.exports = app;
