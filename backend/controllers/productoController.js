const { Producto } = require('../models');
const { validationResult } = require('express-validator');

// Función para crear un nuevo producto
exports.crearProducto = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const { codigo, nombre, descripcion, precio, categoria_id, stock, estado, usuario_id } = req.body;

  try {
    const nuevoProducto = await Producto.create({
      codigo,
      nombre,
      descripcion,
      precio,
      categoria_id,
      stock,
      estado,
      usuario_id,
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear producto', error });
  }
};

// Función para editar un producto existente
exports.editarProducto = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const { id } = req.params;
  const { codigo, nombre, descripcion, precio, categoria_id, stock, estado, usuario_id } = req.body;

  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    producto.codigo = codigo || producto.codigo;
    producto.nombre = nombre || producto.nombre;
    producto.descripcion = descripcion || producto.descripcion;
    producto.precio = precio || producto.precio;
    producto.categoria_id = categoria_id || producto.categoria_id;
    producto.stock = stock || producto.stock;
    producto.estado = estado || producto.estado;
    producto.usuario_id = usuario_id || producto.usuario_id;

    await producto.save();
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ msg: 'Error al editar producto', error });
  }
};

// Función para eliminar (cambiar estado a inactivo) un producto
exports.eliminarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    producto.estado = 'inactivo';
    await producto.save();
    res.status(200).json({ msg: 'Producto eliminado (estado inactivo)' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar producto', error });
  }
};

// Función para buscar todos los productos
exports.buscarProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar productos', error });
  }
};

// Función para buscar un producto por su ID
exports.buscarProductoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar producto por ID', error });
  }
};

// Función para buscar un producto por su nombre
exports.buscarProductoPorNombre = async (req, res) => {
  const { nombre } = req.params;

  try {
    const productos = await Producto.findAll({ where: { nombre } });
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar producto por nombre', error });
  }
};

// Función para buscar productos por categoría
exports.buscarProductoPorCategoria = async (req, res) => {
  const { categoria_id } = req.params;

  try {
    const productos = await Producto.findAll({ where: { categoria_id } });
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar productos por categoría', error });
  }
};