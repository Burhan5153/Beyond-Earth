const mongoose = require('mongoose');

const landPurchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  landType: {
    type: String,
    enum: ['residential', 'commercial', 'luxury'],
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  ownershipCertificate: {
    certificateNumber: String,
    issueDate: Date,
    registrationDetails: String
  },
  mapLocation: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'registered'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LandPurchase', landPurchaseSchema);

