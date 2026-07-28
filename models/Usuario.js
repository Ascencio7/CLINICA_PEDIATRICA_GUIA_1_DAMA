const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Esquema de la base
const UsuarioSchema = mongoose.Schema({
    nombreUsuario: {
        type: String,
        required: true
    },
    contraseña: {
        type: String,
        required: true
    },
    rol: {
        type: String, 
        required: true
    } // admin, user
});

// Middleware para encriptar contra antes de guardarla
UsuarioSchema.pre('save', async function (next){
    if(!this.isModified('contraseña')){
        return next();
    }

    const salt = await brcrypt.genSalt(10);
    this.contraseña = await brcrypt.hash(this.contraseña, salt);
    next();
});

module.exports = mongoose.model('Usuario', UsuarioSchema);