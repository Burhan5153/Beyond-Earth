const mongoose = require('mongoose');
const Activity = require('./models/Activity');
require('dotenv').config();

const activities = [
  {
    name: 'Mars Walking Tours',
    type: 'mars-walking',
    description: 'Explore different zones of Mars on foot with our expert guides. Experience the unique terrain and geological features of the Red Planet.',
    price: 25000,
    duration: '2-4 hours',
    available: true,
    planet: 'mars'
  },
  {
    name: 'Mars Rover Ride',
    type: 'rover-ride',
    description: 'Drive the official Mars Rover across the planet surface. Experience the thrill of operating a real space vehicle on Mars.',
    price: 50000,
    duration: '1-2 hours',
    available: true,
    planet: 'mars'
  },
  {
    name: 'Galaxy Space Photography Session',
    type: 'photography',
    description: 'Capture stunning photos of galaxies and space during your journey. Professional equipment and guidance included.',
    price: 15000,
    duration: '1 hour',
    available: true,
    planet: 'mars'
  },
  {
    name: 'Mars Souvenir Collection',
    type: 'souvenirs',
    description: 'Collect authentic Mars souvenirs and have them delivered to Earth. Includes certified Mars rocks and exclusive memorabilia.',
    price: 10000,
    duration: 'N/A',
    available: true,
    planet: 'mars'
  },
  {
    name: 'Buy Land on Mars',
    type: 'land-purchase',
    description: 'Purchase and own land on Mars. Receive official ownership certificate and registration details.',
    price: 50000,
    duration: 'Lifetime',
    available: true,
    planet: 'mars'
  },
  {
    name: 'Moon Walking Experience',
    type: 'moon-walking',
    description: 'Experience simulated moon walking tours. Future expansion will include real moon landings.',
    price: 30000,
    duration: '2-3 hours',
    available: true,
    planet: 'moon'
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beyond-earth');

    console.log('Connected to MongoDB');

    // Clear existing activities
    await Activity.deleteMany({});
    console.log('Cleared existing activities');

    // Insert new activities
    await Activity.insertMany(activities);
    console.log('Seeded activities:', activities.length);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();

