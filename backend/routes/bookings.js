const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

// PROTECTED (Guest): Create a new booking request
router.post('/', [auth, requireRole(['guest'])], async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body,
      guestId: req.user.id 
    });
    const savedBooking = await newBooking.save();
    res.json(savedBooking);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// PROTECTED (Guest): View own upcoming and past trips
router.get('/guest/:guestId', [auth, requireRole(['guest'])], async (req, res) => {
  try {
    if (req.user.id !== req.params.guestId) return res.status(403).json({ message: 'Unauthorized' });
    const bookings = await Booking.find({ guestId: req.params.guestId })
      .populate('listingId').populate('hostId', 'fullName phone');
    res.json(bookings);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// PROTECTED (Host): View requests for own properties
router.get('/host/:hostId', [auth, requireRole(['host'])], async (req, res) => {
  try {
    if (req.user.id !== req.params.hostId) return res.status(403).json({ message: 'Unauthorized' });
    const bookings = await Booking.find({ hostId: req.params.hostId })
      .populate('listingId').populate('guestId', 'fullName phone email');
    res.json(bookings);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// PROTECTED: Hosts can accept/decline their own requests; guests can cancel their own.
router.put('/:id', [auth, requireRole(['host', 'guest'])], async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    const { bookingStatus } = req.body;
    if (req.user.role === 'host') {
      if (String(booking.hostId) !== req.user.id) {
        return res.status(403).json({ message: 'You cannot update another host’s booking.' });
      }
      if (!['Confirmed', 'Declined'].includes(bookingStatus)) {
        return res.status(400).json({ message: 'Hosts may only confirm or decline booking requests.' });
      }
    } else {
      if (String(booking.guestId) !== req.user.id) {
        return res.status(403).json({ message: 'You can only update your own bookings.' });
      }
      if (bookingStatus !== 'Cancelled') {
        return res.status(400).json({ message: 'Guests may only cancel their own booking requests.' });
      }
    }

    booking.bookingStatus = bookingStatus;
    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error('Booking update error:', err.message);
    res.status(500).json({ message: 'Unable to update booking.' });
  }
});

module.exports = router;