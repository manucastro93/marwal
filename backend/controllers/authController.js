const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Función para autenticar a un usuario y generar un token JWT
exports.loginUsuario = async (req, res) => {
  const { usuario, contraseña } = req.body;
  try {
    const esUsuarioValido = await Usuario.findOne({ where: { usuario } });
    if (!esUsuarioValido) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    const esContraseñaValida = await bcrypt.compare(contraseña, esUsuarioValido.contraseña);
    if (!esContraseñaValida) {
      return res.status(401).json({ msg: 'Contraseña incorrecta' });
    }
    const token = jwt.sign({ id: esUsuarioValido.id, rol: esUsuarioValido.rol }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ msg: 'Error al iniciar sesión', error });
  }
};

// Función para invalidar el token JWT del usuario (logout)
exports.logoutUsuario = (req, res) => {
  res.status(200).json({ msg: 'Sesión cerrada correctamente' });
};


// Función para obtener la información del usuario conectado
exports.obtenerUsuarioConectado = async (req, res) => {
  try {
    const usuario = req.usuario;
    try {
      const user = await Usuario.findByPk(usuario.id, { attributes: { exclude: ['contraseña'] } });
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};