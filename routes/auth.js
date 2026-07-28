const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const router = express.Router();

router.post('/login', async (req, res)=>{
    const {nombreUsuario, contraseña} = req.body;
    const usuario = await Usuario.findOne({nombreUsuario});

    if(!usuario){
        return res.status(404).json({msg: 'El usuario no existe'});
    }

    const esCoincidente = await bcrypt.compare(contraseña, usuario.contraseña);

    if(!esCoincidente){
        return res.status(400).json({msg: 'La contraseña es incorrecta'});
    }

    const token = jwt.sign({
        id: usuario._id,
        rol: usuario.rol,        
    }, 'secret', {expiresIn: '1d'});
    res.json({token});
});

module.exports = router;