const Usuario = require('../models/Usuario');
const Cliente = require('../models/Cliente');
const bcrypt = require('bcrypt');
const { generateLink } = require('../utils/generateLink');

// Agregar vendedor
exports.agregarVendedor = async (req, res) => {
  const { usuario, nombre, email, telefono, contraseña } = req.body;

  if (!usuario || !nombre || !email || !contraseña) {
    return res.status(400).json({ error: 'Todos los campos excepto teléfono son obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const newVendedor = await Usuario.create({
      usuario,
      nombre,
      email,
      telefono,
      contraseña: hashedPassword,
      rol: 'vendedor',
      link: generateLink(),
      estado: 'activo',
    });

    res.status(201).json(newVendedor);
  } catch (error) {
    console.error('Error al agregar el vendedor:', error);
    res.status(500).json({ error: 'Error al agregar el vendedor' });
  }
};

// Modificar vendedor
exports.modificarVendedor = async (req, res) => {
  const { id } = req.params;
  const { usuario, nombre, email, telefono, contraseña } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID del vendedor es obligatorio' });
  }

  try {
    const vendedor = await Usuario.findByPk(id);
    if (!vendedor || vendedor.rol !== 'vendedor') {
      return res.status(404).json({ error: 'Vendedor no encontrado' });
    }

    const hashedPassword = contraseña ? await bcrypt.hash(contraseña, 10) : vendedor.contraseña;

    await vendedor.update({
      usuario,
      nombre,
      email,
      telefono,
      contraseña: hashedPassword,
    });

    res.status(200).json(vendedor);
  } catch (error) {
    console.error('Error al modificar el vendedor:', error);
    res.status(500).json({ error: 'Error al modificar el vendedor' });
  }
};

// Eliminar vendedor
exports.eliminarVendedor = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID del vendedor es obligatorio' });
  }

  try {
    const vendedor = await Usuario.findByPk(id);
    if (!vendedor || vendedor.rol !== 'vendedor') {
      return res.status(404).json({ error: 'Vendedor no encontrado' });
    }

    await vendedor.update({ estado: 'eliminado' });
    res.status(200).json({ message: 'Vendedor marcado como eliminado' });
  } catch (error) {
    console.error('Error al eliminar el vendedor:', error);
    res.status(500).json({ error: 'Error al eliminar el vendedor' });
  }
};

// Obtener vendedores
exports.obtenerVendedores = async (req, res) => {
  try {
    const vendedores = await Usuario.findAll({ where: { rol: 'vendedor', estado: 'activo' } });
    res.status(200).json(vendedores);
  } catch (error) {
    console.error('Error al obtener los vendedores:', error);
    res.status(500).json({ error: 'Error al obtener los vendedores' });
  }
};

// Obtener vendedor por link
exports.obtenerVendedorPorLink = async (req, res) => {
  const { link } = req.params;

  try {
    const vendedor = await Usuario.findOne({ where: { link, rol: 'vendedor', estado: 'activo' } });

    if (!vendedor) {
      return res.status(404).json({ error: 'Vendedor no encontrado' });
    }

    res.status(200).json({ id: vendedor.id });
  } catch (error) {
    console.error('Error al obtener el vendedor por link:', error);
    res.status(500).json({ error: 'Error al obtener el vendedor' });
  }
};