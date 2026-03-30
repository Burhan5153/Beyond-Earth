const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tripType: {
    type: String,
    enum: ['mars'],
    default: 'mars'
  },
  mainTicket: {
    spaceship: { type: Boolean, default: true },
    landing: { type: Boolean, default: true },
    galaxyViewing: { type: Boolean, default: true },
    basicTour: { type: Boolean, default: true }
  },
  additionalActivities: [{
    activityType: {
      type: String,
      enum: ['mars-walking', 'rover-ride', 'photography', 'souvenirs', 'land-purchase', 'moon-walking']
    },
    booked: {
      type: Boolean,
      default: false
    },
    bookingDate: Date,
    price: Number
  }],
  flightDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  spaceshipLocation: {
    latitude: Number,
    longitude: Number,
    altitude: Number,
    lastUpdated: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);

