const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  location: { type: String, required: true },
  roomType: { type: String, required: true },
  basePrice: { type: Number, required: true },
  image: { type: String },
  description: { type: String },
  amenities: [{ type: String }],
  status: { type: String, default: 'Pending Approval' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', listingSchema);
