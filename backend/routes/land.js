const express = require('express');
const auth = require('../middleware/auth');
const LandPurchase = require('../models/LandPurchase');
const router = express.Router();

// Purchase land
router.post('/', auth, async (req, res) => {
  try {
    const { bookingId, landType, size, price, coordinates } = req.body;

    // Generate certificate number
    const certificateNumber = `BE-LAND-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Ensure coordinates are numbers (handle both string and number inputs)
    const finalCoordinates = coordinates || {
      latitude: Math.random() * 180 - 90,
      longitude: Math.random() * 360 - 180
    };

    // Convert to numbers if they're strings
    const lat = typeof finalCoordinates.latitude === 'string' 
      ? parseFloat(finalCoordinates.latitude) 
      : finalCoordinates.latitude;
    const lng = typeof finalCoordinates.longitude === 'string' 
      ? parseFloat(finalCoordinates.longitude) 
      : finalCoordinates.longitude;

    const landPurchase = new LandPurchase({
      user: req.user._id,
      booking: bookingId,
      landType,
      size,
      price,
      coordinates: {
        latitude: lat,
        longitude: lng
      },
      ownershipCertificate: {
        certificateNumber,
        issueDate: new Date(),
        registrationDetails: `Registered land purchase on Mars - ${landType} land, ${size} sq km`
      },
      mapLocation: `Mars Coordinates: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`,
      status: 'confirmed'
    });

    await landPurchase.save();
    await landPurchase.populate('user', 'name email');
    await landPurchase.populate('booking');

    res.status(201).json(landPurchase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's land purchases
router.get('/my-land', auth, async (req, res) => {
  try {
    const landPurchases = await LandPurchase.find({ user: req.user._id })
      .populate('booking')
      .sort({ createdAt: -1 });
    res.json(landPurchases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single land purchase
router.get('/:id', auth, async (req, res) => {
  try {
    const landPurchase = await LandPurchase.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('booking').populate('user', 'name email');

    if (!landPurchase) {
      return res.status(404).json({ message: 'Land purchase not found' });
    }

    res.json(landPurchase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete land purchase
router.delete('/:id', auth, async (req, res) => {
  try {
    const landPurchase = await LandPurchase.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!landPurchase) {
      return res.status(404).json({ message: 'Land purchase not found' });
    }

    await LandPurchase.findByIdAndDelete(req.params.id);
    res.json({ message: 'Land purchase deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

