const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Booking = require('../models/Booking');

// All administration endpoints require a valid administrator session.
router.use(auth, requireRole(['admin']));

router.get('/overview', async (req, res) => {
  try {
    const [
      totalUsers, guestUsers, hostUsers, activeListings, pendingListings,
      totalBookings, confirmedBookings, confirmedValue
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'guest' }),
      User.countDocuments({ role: 'host' }),
      Listing.countDocuments({ status: 'Active' }),
      Listing.countDocuments({ status: 'Pending Approval' }),
      Booking.countDocuments(),
      Booking.countDocuments({ bookingStatus: 'Confirmed' }),
      Booking.aggregate([
        { $match: { bookingStatus: 'Confirmed' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ])
    ]);

    res.json({
      totalUsers, guestUsers, hostUsers, activeListings, pendingListings,
      totalBookings, confirmedBookings,
      confirmedBookingValue: confirmedValue[0]?.total || 0
    });
  } catch (error) {
    console.error('Admin overview error:', error.message);
    res.status(500).json({ message: 'Unable to load administrator overview.' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
      .select('fullName email role createdAt')
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();
    res.json(users);
  } catch (error) {
    console.error('Admin users error:', error.message);
    res.status(500).json({ message: 'Unable to load registered users.' });
  }
});

module.exports = router;
