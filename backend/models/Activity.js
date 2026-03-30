const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['mars-walking', 'rover-ride', 'photography', 'souvenirs', 'land-purchase', 'moon-walking'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  image: String,
  planet: {
    type: String,
    enum: ['mars', 'moon', 'venus', 'jupiter'],
    default: 'mars'
  }
});

module.exports = mongoose.model('Activity', activitySchema);

