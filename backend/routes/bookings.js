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

// PROTECTED (Host or Guest): Update booking status (Host accepts/declines, Guest pays/cancels)
router.put('/:id', [auth, requireRole(['host', 'guest'])], async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedBooking);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;