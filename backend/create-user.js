const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('./models/Usuario');

const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://vladimirramos405_db_user:xkAM3Ju0n92LV0Qp@cluster0.mno5obw.mongodb.net/sistema-clinica?retryWrites=true&w=majority&appName=Cluster0';
const nombreUsuario = process.env.APP_USER || 'admin';
const contraseña = process.env.APP_PASSWORD || 'admin123';

async function createUser() {
  try {
    await mongoose.connect(MONGO_URL);
    let usuario = await Usuario.findOne({ nombreUsuario });

    if (!usuario) {
      usuario = new Usuario({ nombreUsuario, contraseña, rol: 'admin' });
    } else {
      usuario.contraseña = contraseña;
      usuario.rol = 'admin';
    }

    await usuario.save();
    console.log(`Usuario listo: ${nombreUsuario}`);
  } catch (error) {
    console.error('No se pudo crear el usuario:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

createUser();
