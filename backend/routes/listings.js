const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

// PUBLIC: Get all active listings (Guests searching the homepage)
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'Active' });
    res.json(listings);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// PROTECTED (Host): Create a new listing
router.post('/', [auth, requireRole(['host'])], async (req, res) => {
  try {
    const newListing = new Listing({
      ...req.body,
      hostId: req.user.id // Force the hostId to be the logged-in user's token ID for security
    });
    const savedListing = await newListing.save();
    res.json(savedListing);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// PROTECTED (Host): Get listings owned by a specific host
router.get('/host/:hostId', [auth, requireRole(['host'])], async (req, res) => {
  try {
    // Ensure hosts can only view their own dashboard data
    if (req.user.id !== req.params.hostId) {
      return res.status(403).json({ message: 'Cannot access another host\'s listings.' });
    }
    const listings = await Listing.find({ hostId: req.params.hostId });
    res.json(listings);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// PROTECTED (Admin): Get all pending listings for the moderation dashboard
router.get('/pending', [auth, requireRole(['admin'])], async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'Pending Approval' }).populate('hostId', 'fullName email');
    res.json(listings);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// PROTECTED (Admin): Update a listing's status (Approve/Reject)
router.put('/:id', [auth, requireRole(['admin'])], async (req, res) => {
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.status } },
      { new: true }
    );
    res.json(updatedListing);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;