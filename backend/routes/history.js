const express = require('express');
const router = express.Router();
const History = require('../models/History');

// Get history for patient
router.get('/:patientId', async (req, res) => {
  try {
    const items = await History.find({ patientId: req.params.patientId }).sort({ date: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add note
router.post('/:patientId', async (req, res) => {
  try {
    const { note } = req.body;
    const h = new History({ patientId: req.params.patientId, note });
    await h.save();
    res.status(201).json(h);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
