const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function seedAdmin() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/beyond-earth';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Admin credentials from environment variables or defaults
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@beyondearth.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';
    const adminName = process.env.ADMIN_NAME || 'Admin User';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      if (existingAdmin.role === 'admin') {
        console.log('Admin user already exists:', adminEmail);
        console.log('To update password, delete the user first or update manually in MongoDB');
        process.exit(0);
      } else {
        // Update existing user to admin
        existingAdmin.role = 'admin';
        existingAdmin.password = adminPassword; // Will be hashed by pre-save hook
        await existingAdmin.save();
        console.log('Updated existing user to admin:', adminEmail);
        process.exit(0);
      }
    }

    // Create new admin user
    const admin = new User({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Role: admin');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdmin();

