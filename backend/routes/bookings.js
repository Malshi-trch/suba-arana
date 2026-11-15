
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

// CREATE BOOKING - Guest only
router.post('/', [auth, requireRole(['guest'])], async (req, res) => {
  try {
    const {
      listingId,
      checkIn,
      checkOut,
      guestCount,
      notes
    } = req.body;

    if (!mongoose.isValidObjectId(listingId)) {
      return res.status(400).json({ message: 'Invalid property ID.' });
    }

    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: 'Select check-in and check-out dates.' });
    }

    const start = new Date(`${checkIn}T00:00:00.000Z`);
    const end = new Date(`${checkOut}T00:00:00.000Z`);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid booking dates.' });
    }

    if (start < today || end <= start) {
      return res.status(400).json({
        message: 'Choose valid future dates. Check-out must be after check-in.'
      });
    }

    const count = Number(guestCount);

    if (!Number.isInteger(count) || count < 1 || count > 5) {
      return res.status(400).json({
        message: 'Guest count must be between 1 and 5.'
      });
    }

    const listing = await Listing.findOne({
      _id: listingId,
      status: 'Active'
    });

    if (!listing) {
      return res.status(404).json({
        message: 'This property is not available for booking.'
      });
    }

    const hostId = listing.hostId;

    // Check existing confirmed booking date conflicts
    const conflict = await Booking.findOne({
      listingId,
      bookingStatus: 'Confirmed',
      checkIn: { $lt: end },
      checkOut: { $gt: start }
    });

    if (conflict) {
      return res.status(409).json({
        message: 'This property is already booked for the selected dates.'
      });
    }

    const nights = Math.round(
      (end.getTime() - start.getTime()) / 86400000
    );

    // Calculate price on the backend
    const totalPrice = Number(listing.basePrice) * nights;

    if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
      return res.status(400).json({
        message: 'Invalid property price.'
      });
    }

    const booking = await Booking.create({
      guestId: req.user.id,
      listingId: listing._id,
      hostId,
      checkIn: start,
      checkOut: end,
      guestCount: count,
      totalPrice,
      notes: String(notes || '').slice(0, 500)
    });

    res.status(201).json({
      message: 'Booking request submitted successfully.',
      booking
    });

  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ message: 'Unable to create booking.' });
  }
});


// VIEW GUEST BOOKINGS
router.get('/guest/:guestId', [auth, requireRole(['guest'])], async (req, res) => {
  try {
    if (String(req.user.id) !== req.params.guestId) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    const bookings = await Booking.find({
      guestId: req.user.id
    })
      .populate('listingId')
      .populate('hostId', 'fullName phone')
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (err) {
    console.error('Guest bookings error:', err);
    res.status(500).json({ message: 'Unable to load bookings.' });
  }
});


// VIEW HOST BOOKINGS
router.get('/host/:hostId', [auth, requireRole(['host'])], async (req, res) => {
  try {
    if (String(req.user.id) !== req.params.hostId) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    const bookings = await Booking.find({
      hostId: req.user.id
    })
      .populate('listingId')
      .populate('guestId', 'fullName phone email')
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (err) {
    console.error('Host bookings error:', err);
    res.status(500).json({ message: 'Unable to load bookings.' });
  }
});


// UPDATE BOOKING STATUS
router.put('/:id', [auth, requireRole(['host', 'guest'])], async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid booking ID.' });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    const { bookingStatus } = req.body;

    if (booking.bookingStatus !== 'Pending') {
      return res.status(400).json({
        message: 'Only pending bookings can be updated.'
      });
    }

    if (req.user.role === 'host') {
      if (String(booking.hostId) !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized host.' });
      }

      if (!['Confirmed', 'Declined'].includes(bookingStatus)) {
        return res.status(400).json({
          message: 'Hosts can only confirm or decline requests.'
        });
      }

      if (bookingStatus === 'Confirmed') {
        const conflict = await Booking.findOne({
          _id: { $ne: booking._id },
          listingId: booking.listingId,
          bookingStatus: 'Confirmed',
          checkIn: { $lt: booking.checkOut },
          checkOut: { $gt: booking.checkIn }
        });

        if (conflict) {
          return res.status(409).json({
            message: 'These dates have already been confirmed for another guest.'
          });
        }
      }

    } else {
      if (String(booking.guestId) !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized guest.' });
      }

      if (bookingStatus !== 'Cancelled') {
        return res.status(400).json({
          message: 'Guests can only cancel pending bookings.'
        });
      }
    }

    booking.bookingStatus = bookingStatus;
    await booking.save();

    res.json({
      message: 'Booking updated successfully.',
      booking
    });

  } catch (err) {
    console.error('Update booking error:', err);
    res.status(500).json({ message: 'Unable to update booking.' });
  }
});

module.exports = router;
