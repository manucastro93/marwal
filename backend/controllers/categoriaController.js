const { Categoria } = require('../models');
const { validationResult } = require('express-validator');

// Función para crear una nueva categoría
exports.crearCategoria = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const { nombre, estado, usuario_id } = req.body;

  try {
    const nuevaCategoria = await Categoria.create({
      nombre,
      estado,
      usuario_id,
    });

    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear categoría', error });
  }
};

// Función para editar una categoría existente
exports.editarCategoria = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const { id } = req.params;
  const { nombre, estado, usuario_id } = req.body;

  try {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ msg: 'Categoría no encontrada' });
    }

    categoria.nombre = nombre || categoria.nombre;
    categoria.estado = estado || categoria.estado;
    categoria.usuario_id = usuario_id || categoria.usuario_id;

    await categoria.save();
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ msg: 'Error al editar categoría', error });
  }
};

// Función para eliminar (cambiar estado a inactivo) una categoría
exports.eliminarCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ msg: 'Categoría no encontrada' });
    }

    categoria.estado = 'inactivo';
    await categoria.save();
    res.status(200).json({ msg: 'Categoría eliminada (estado inactivo)' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar categoría', error });
  }
};

// Función para buscar todas las categorías
exports.buscarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar categorías', error });
  }
};