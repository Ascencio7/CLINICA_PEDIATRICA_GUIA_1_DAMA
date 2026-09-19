const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { nombreUsuario, contraseña, password } = req.body;
    const plainPassword = contraseña || password;
    if (!nombreUsuario || !plainPassword) {
      return res.status(400).json({ msg: 'Usuario y contraseña son obligatorios' });
    }

    const existente = await Usuario.findOne({ nombreUsuario });
    if (existente) {
      return res.status(409).json({ msg: 'El usuario ya existe' });
    }

    const usuario = new Usuario({ nombreUsuario, contraseña: plainPassword, rol: 'user' });
    await usuario.save();
    res.status(201).json({ msg: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'No se pudo registrar el usuario' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { nombreUsuario, contraseña, password } = req.body;
    const plainPassword = contraseña || password;
    const usuario = await Usuario.findOne({ nombreUsuario });

    if (!usuario) return res.status(404).json({ msg: 'El usuario no existe' });

    const esCoincidente = await bcrypt.compare(plainPassword, usuario.contraseña);
    if (!esCoincidente) return res.status(400).json({ msg: 'La contraseña es incorrecta' });

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );
    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).json({ msg: 'No se pudo consultar la base de datos' });
  }
});

module.exports = router;
