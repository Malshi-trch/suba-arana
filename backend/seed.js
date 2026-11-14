
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const password = await bcrypt.hash('password123', 10);

    const testUsers = [
      {
        fullName: 'Amaya Senanayake',
        email: 'traveler@example.com',
        phone: '+94 71 111 1111',
        role: 'guest'
      },
      {
        fullName: 'Nimal Rathnayake',
        email: 'host@subaarana.lk',
        phone: '+94 77 222 2222',
        role: 'host'
      },
      {
        fullName: 'System Administrator',
        email: 'admin@subaarana.lk',
        phone: '+94 70 333 3333',
        role: 'admin'
      }
    ];

    for (const user of testUsers) {
      await User.findOneAndUpdate(
        { email: user.email },
        { $set: { ...user, password } },
        { upsert: true, new: true, runValidators: true }
      );

      console.log(`Created/updated ${user.role}: ${user.email}`);
    }

    console.log('Test accounts are ready.');
  } catch (error) {
    console.error('Seeding failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedUsers();
