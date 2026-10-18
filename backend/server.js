const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Servidor http
const app = express();

// Configuraciones http
app.use(bodyParser.json());
app.use(cors());

// Conexion a la base de datos
const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://vladimirramos405_db_user:xkAM3Ju0n92LV0Qp@cluster0.mno5obw.mongodb.net/sistema-clinica?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URL)
    .then(() => console.log('MongoDB conectado a', MONGO_URL))
    .catch(err => {
        console.error('Error conectando a MongoDB:', err.message);
    });

mongoose.connection.on('error', err => console.error('MongoDB connection error:', err));
mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));

// Rutas
const patientsRoutes = require('./routes/patients');
const appointmentsRoutes = require('./routes/appointments');
const historyRoutes = require('./routes/history');
const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/history', historyRoutes);

// Configurar el puerto para el back
const port = process.env.PORT || 5000;

app.listen(port, '0.0.0.0', () => {
    console.log('\n');
    console.log(`Servidor backend ejecutándose correctamente`);
    console.log(`Puerto activo: ${port}`);
    console.log(`Local: http://localhost:${port}`);
    console.log(`Red local: http://0.0.0.0:${port}`);
    console.log('Rutas activas: /api/auth /api/patients /api/appointments /api/history\n');
});