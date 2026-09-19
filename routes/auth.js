const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../backend/models/Usuario');

const router = express.Router();

router.post('/register', async (req, res)=>{
    try {
        const {nombreUsuario, contraseña} = req.body;
        if (!nombreUsuario || !contraseña) {
            return res.status(400).json({msg: 'Usuario y contraseña son obligatorios'});
        }

        const existente = await Usuario.findOne({nombreUsuario});
        if (existente) {
            return res.status(409).json({msg: 'El usuario ya existe'});
        }

        const usuario = new Usuario({nombreUsuario, contraseña, rol: 'user'});
        await usuario.save();
        res.status(201).json({msg: 'Usuario registrado correctamente'});
    } catch (error) {
        res.status(500).json({msg: 'No se pudo registrar el usuario'});
    }
});

router.post('/login', async (req, res)=>{
    try {
        const {nombreUsuario, contraseña} = req.body;
        const usuario = await Usuario.findOne({nombreUsuario});

        if(!usuario){
            return res.status(404).json({msg: 'El usuario no existe'});
        }

        const esCoincidente = await bcrypt.compare(contraseña, usuario.contraseña);

        if(!esCoincidente){
            return res.status(400).json({msg: 'La contraseña es incorrecta'});
        }

        const token = jwt.sign({
            id: usuario._id,
            rol: usuario.rol,
        }, 'secret', {expiresIn: '1d'});
        res.json({token});
    } catch (error) {
        res.status(500).json({msg: 'No se pudo consultar la base de datos'});
    }
});

module.exports = router;