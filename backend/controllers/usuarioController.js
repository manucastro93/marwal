const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const config = require('../config/config');

// Registro de usuarios
exports.registrarUsuario = async (req, res) => {
  const { usuario, nombre, email, telefono, contraseña, rol } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const data = {
      usuario,
      nombre,
      email,
      telefono,
      contraseña: hashedPassword,
      rol,
    };

    // Generar link único si el rol es vendedor
    if (rol === 'vendedor') {
      data.link = generateLink();
    }

    const newUser = await Usuario.create(data);

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login de usuarios
exports.loginUsuario = async (req, res) => {
  const { usuario, contraseña } = req.body;

  // Agregar logs para verificar los datos recibidos
  console.log("Usuario:", usuario);
  console.log("Contraseña:", contraseña);

  try {
    if (!usuario || !contraseña) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    const user = await Usuario.findOne({ where: { usuario } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id, rol: user.rol }, config.jwtSecret, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Búsqueda de usuarios por parámetro
exports.buscarUsuarios = async (req, res) => {
  const { nombre, email, rol } = req.query;

  try {
    const where = {};
    if (nombre) where.nombre = nombre;
    if (email) where.email = email;
    if (rol) where.rol = rol;

    const usuarios = await Usuario.findAll({ where });

    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};