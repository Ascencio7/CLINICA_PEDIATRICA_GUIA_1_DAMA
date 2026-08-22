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
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/sistema-clinica';

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

app.use('/api/patients', patientsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/history', historyRoutes);

// Configurar el puerto para el back
const port = process.env.PORT || 5000;

app.listen(port, '0.0.0.0', () =>{
    console.log(`Servidor ejecutandose en el puerto ${port}`);
    console.log('Rutas activas: /api/patients /api/appointments /api/history');
})