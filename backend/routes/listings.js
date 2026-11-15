const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const Listing = require('../models/Listing');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');


// Image upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },

  filename: (req, file, cb) => {
    const uniqueName =
      `${Date.now()}-${crypto.randomBytes(6).toString('hex')}` +
      path.extname(file.originalname).toLowerCase();

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024 // Maximum 5MB
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG and WEBP images are allowed.'));
    }
  }
});

// PUBLIC: Get all active listings (Guests searching the homepage)
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'Active' });
    res.json(listings);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// PROTECTED (Host): Create a new listing with an image
router.post(
  '/',
  [auth, requireRole(['host'])],
  upload.single('image'),
  async (req, res) => {
    try {
      const listingData = {
        ...req.body,
        hostId: req.user.id,
        basePrice: Number(req.body.basePrice),
        amenities: JSON.parse(req.body.amenities || '[]'),
        image: req.file ? `/uploads/${req.file.filename}` : ''
      };

      const newListing = new Listing(listingData);

      const savedListing = await newListing.save();

      res.status(201).json(savedListing);

    } catch (err) {
      console.error('Listing upload error:', err);

      res.status(500).json({
        message: err.message || 'Could not create property.'
      });
    }
  }
);

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