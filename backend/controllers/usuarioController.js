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

// Logout de usuarios
exports.logoutUsuario = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al cerrar sesión' });
      }
      res.clearCookie('connect.sid'); // Limpia la cookie de sesión
      res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Renovar token
exports.renovarToken = async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret, { ignoreExpiration: true });
    const user = await Usuario.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const newToken = jwt.sign({ id: user.id, rol: user.rol }, config.jwtSecret, {
      expiresIn: '1h',
    });

    res.json({ token: newToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener usuario actual logueado
exports.getCurrentUser = async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authorizationHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await Usuario.findByPk(decoded.id, { attributes: { exclude: ['contraseña'] } });

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

// Buscar usuarios
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