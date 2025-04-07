const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');
const { validationResult } = require('express-validator');
// Función para crear un nuevo vendedor
exports.crearVendedor = async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(JSON.stringify({ errores: errors.array() }, null, 2));
    return res.status(400).json({ errores: errors.array() });
  }

  const { usuario, nombre, email, telefono, contraseña, rol } = req.body;
  
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);
    const nuevoUsuario = await Usuario.create({
      usuario,
      nombre,
      email,
      telefono,
      contraseña: hashedPassword,
      rol
    });
    console.log('Nuevo vendedor creado:', nuevoUsuario);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear vendedor', error });
  }
};

// Función para editar un vendedor existente
exports.editarVendedor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const { id } = req.params;
  const { nombre, email, telefono, contraseña } = req.body;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Vendedor no encontrado' });
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
    res.status(500).json({ msg: 'Error al editar vendedor', error });
  }
};

// Función para eliminar (cambiar estado a inactivo) un vendedor
exports.eliminarVendedor = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Vendedor no encontrado' });
    }

    usuario.estado = 'inactivo';
    await usuario.save();
    res.status(200).json({ msg: 'Vendedor eliminado (estado inactivo)' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar vendedor', error });
  }
};

// Función para buscar todos los vendedores
exports.buscarVendedores = async (req, res) => {
  try {
    const vendedores = await Usuario.findAll({ where: { rol: 'vendedor' } });
    res.status(200).json(vendedores);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar vendedores', error });
  }
};

// Función para buscar un vendedor por su ID
exports.buscarVendedorPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const vendedor = await Usuario.findOne({ where: { id, rol: 'vendedor' } });
    if (!vendedor) {
      return res.status(404).json({ msg: 'Vendedor no encontrado' });
    }

    res.status(200).json(vendedor);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar vendedor por ID', error });
  }
};