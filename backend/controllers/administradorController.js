const { Usuario } = require('../models');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Función para crear un nuevo administrador
exports.crearAdministrador = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const { usuario, nombre, email, telefono, contraseña } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    const nuevoAdministrador = await Usuario.create({
      usuario,
      nombre,
      email,
      telefono,
      contraseña: hashedPassword,
      rol: 'administrador',
    });

    res.status(201).json(nuevoAdministrador);
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear administrador', error });
  }
};

// Función para editar un administrador existente
exports.editarAdministrador = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const { id } = req.params;
  const { nombre, email, telefono, contraseña } = req.body;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Administrador no encontrado' });
    }

    if (contraseña) {
      const salt = await bcrypt.genSalt(10);
      usuario.contraseña = await bcrypt.hash(contraseña, salt);
    }
    usuario.nombre = nombre || usuario.nombre;
    usuario.email = email || usuario.email;
    usuario.telefono = telefono || usuario.telefono;

    await usuario.save();
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ msg: 'Error al editar administrador', error });
  }
};

// Función para eliminar (cambiar estado a inactivo) un administrador
exports.eliminarAdministrador = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Administrador no encontrado' });
    }

    usuario.estado = 'inactivo';
    await usuario.save();
    res.status(200).json({ msg: 'Administrador eliminado (estado inactivo)' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar administrador', error });
  }
};

// Función para buscar todos los administradores
exports.buscarAdministradores = async (req, res) => {
  try {
    const administradores = await Usuario.findAll({ where: { rol: 'administrador' } });
    res.status(200).json(administradores);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar administradores', error });
  }
};

// Función para buscar un administrador por su ID
exports.buscarAdministradorPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const administrador = await Usuario.findOne({ where: { id, rol: 'administrador' } });
    if (!administrador) {
      return res.status(404).json({ msg: 'Administrador no encontrado' });
    }

    res.status(200).json(administrador);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar administrador por ID', error });
  }
};