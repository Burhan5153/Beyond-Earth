const express = require('express');
const Activity = require('../models/Activity');
const router = express.Router();

// Get all activities
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find({ available: true });
    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get activity by type
router.get('/:type', async (req, res) => {
  try {
    const activity = await Activity.findOne({ 
      type: req.params.type,
      available: true 
    });
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    res.json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

