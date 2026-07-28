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
mongoose.connect('mongodb://localhost:27017/sistema-clinica', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Rutas
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Configurar el puerto para el back
const port = process.env.PORT || 5000;

app.listen(port, () =>{
    console.log(`Servidor ejecutandose en el puerto ${port}`);
})