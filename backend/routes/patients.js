const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// List patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create patient
router.post('/', async (req, res) => {
  try {
    // Accept both English and Spanish keys
    const name = req.body.name || req.body.nombre;
    const age = req.body.age || req.body.edad;
    const phone = req.body.phone || req.body.telefono || req.body.telefono_celular;
    const email = req.body.email || req.body.correo || req.body.email_address;

    if (!name) return res.status(400).json({ error: 'El nombre es requerido' });

    const p = new Patient({ name, age, phone, email });
    await p.save();
    res.status(201).json(p);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get by id
router.get('/:id', async (req, res) => {
  try {
    const p = await Patient.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'No encontrado' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update patient
router.put('/:id', async (req, res) => {
  try {
    const name = req.body.name || req.body.nombre;
    const age = req.body.age || req.body.edad;
    const phone = req.body.phone || req.body.telefono || req.body.telefono_celular;
    const email = req.body.email || req.body.correo || req.body.email_address;

    const update = {};
    if (name !== undefined) update.name = name;
    if (age !== undefined) update.age = age;
    if (phone !== undefined) update.phone = phone;
    if (email !== undefined) update.email = email;

    const p = await Patient.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!p) return res.status(404).json({ error: 'No encontrado' });
    res.json(p);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
