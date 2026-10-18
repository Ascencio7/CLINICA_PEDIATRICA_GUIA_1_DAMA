const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Mapeado desde 'nombre'
  age: { type: String },                  // Puede ser número o texto (ej: "8 años" o "5 meses")
  phone: { type: String },                // Mapeado desde 'telefono'
  email: { type: String },                // Mapeado desde 'correo'
  address: { type: String },              // Mapeado desde 'direccion'
  birthDate: { type: String },            // Mapeado desde 'fechaNacimiento'
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);