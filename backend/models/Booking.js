
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },

  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  checkIn: {
    type: Date,
    required: true
  },

  checkOut: {
    type: Date,
    required: true
  },

  guestCount: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },

  bookingStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Declined', 'Cancelled'],
    default: 'Pending'
  },

  paymentStatus: {
    type: String,
    enum: ['Awaiting Payment', 'Paid', 'Refunded'],
    default: 'Awaiting Payment'
  },

  notes: {
    type: String,
    maxlength: 500,
    default: ''
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
