const mongoose = require('mongoose');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/sistema-clinica';

async function run() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Conectado a Mongo para seed:', MONGO_URL);

    // Limpiar colecciones
    await Patient.deleteMany({});
    await Appointment.deleteMany({});

    // Crear pacientes de ejemplo
    const patients = await Patient.insertMany([
      { name: 'Carlos Gómez', age: 30, phone: '7890-1234', email: 'carlos.gomez@email.com' },
      { name: 'María Pérez', age: 26, phone: '5566-7788', email: 'maria.perez@email.com' },
    ]);

    console.log('Pacientes creados:', patients.length);

    // Crear citas de ejemplo
    const appts = await Appointment.insertMany([
      { time: '10:30 AM', patientName: patients[0].name, patientId: patients[0]._id, reason: 'Consulta general' },
      { time: '11:00 AM', patientName: patients[1].name, patientId: patients[1]._id, reason: 'Vacunación' },
    ]);

    console.log('Citas creadas:', appts.length);

    console.log('Seed completado.');
  } catch (err) {
    console.error('Error en seed:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
