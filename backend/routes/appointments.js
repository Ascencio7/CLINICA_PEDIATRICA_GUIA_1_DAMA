const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// List appointments
router.get('/', async (req, res) => {
  try {
    const appts = await Appointment.find().sort({ createdAt: -1 });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create
router.post('/', async (req, res) => {
  try {
    // Accept both English and Spanish payload keys
    const time = req.body.time || req.body.hora;
    const patientName = req.body.patientName || req.body.nombre || req.body.nombre_paciente;
    const reason = req.body.reason || req.body.motivo || req.body.descripcion;
    const patientId = req.body.patientId || req.body.pacienteId || req.body.idPaciente;

    if (!patientName || !time) return res.status(400).json({ error: 'Nombre del paciente y hora son requeridos' });

    const a = new Appointment({ time, patientId, patientName, reason });
    await a.save();
    res.status(201).json(a);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update appointment
router.put('/:id', async (req, res) => {
  try {
    const time = req.body.time || req.body.hora;
    const patientName = req.body.patientName || req.body.nombre || req.body.nombre_paciente;
    const reason = req.body.reason || req.body.motivo || req.body.descripcion;
    const patientId = req.body.patientId || req.body.pacienteId || req.body.idPaciente;

    const update = {};
    if (time !== undefined) update.time = time;
    if (patientName !== undefined) update.patientName = patientName;
    if (reason !== undefined) update.reason = reason;
    if (patientId !== undefined) update.patientId = patientId;

    const a = await Appointment.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!a) return res.status(404).json({ error: 'No encontrado' });
    res.json(a);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
