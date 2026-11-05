const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Creating test users...');
    
    // Optional: Clear existing users to prevent duplicates during testing
    await User.deleteMany({});
    
    // Hash the universal test password: 'password123'
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const testUsers = [
      {
        fullName: 'Amaya Senanayake (Guest)',
        email: 'traveler@example.com',
        password: hashedPassword,
        phone: '+94 71 111 1111',
        role: 'guest'
      },
      {
        fullName: 'Nimal Rathnayake (Host)',
        email: 'host@subaarana.lk',
        password: hashedPassword,
        phone: '+94 77 222 2222',
        role: 'host'
      },
      {
        fullName: 'System Administrator',
        email: 'admin@subaarana.lk',
        password: hashedPassword,
        phone: '+94 70 333 3333',
        role: 'admin'
      }
    ];

    await User.insertMany(testUsers);
    console.log('✅ Successfully created Test Guest, Host, and Admin accounts!');
    process.exit();
  })
  .catch(err => {
    console.error('Error seeding database:', err);
    process.exit(1);
  });
  