const { Producto, ImagenProducto, Sequelize } = require('../models');

// Crear producto
exports.crearProducto = async (req, res) => {
  const { codigo, nombre, descripcion, precio, categoria_id, stock, imagenes } = req.body;

  try {
    const newProducto = await Producto.create({
      codigo,
      nombre,
      descripcion,
      precio,
      categoria_id,
      stock
    });

    if (imagenes && imagenes.length > 0) {
      const imagenesData = imagenes.map(image => ({
        producto_id: newProducto.id,
        url: image.url,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await ImagenProducto.bulkCreate(imagenesData);
    }

    // Incluir imágenes en la respuesta
    const productoConImagenes = await Producto.findByPk(newProducto.id, {
      include: {
        model: ImagenProducto,
        as: 'imagenes',
      },
    });

    res.status(201).json(productoConImagenes);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    if (error instanceof Sequelize.UniqueConstraintError) {
      res.status(400).json({ error: `Código de producto duplicado - ${error.message}` });
    } else {
      res.status(500).json({ error: `Error al crear el producto - ${error.message}` });
    }
  }
};

// Modificar producto
exports.modificarProducto = async (req, res) => {
  const { id } = req.params;
  const { codigo, nombre, descripcion, precio, categoria_id, stock, imagenes } = req.body;

  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Actualizar el producto
    await producto.update({
      codigo,
      nombre,
      descripcion,
      precio,
      categoria_id,
      stock,
      updatedAt: new Date() // Asegurarse de actualizar el campo updatedAt
    });

    // Actualizar las imágenes
    if (imagenes && imagenes.length > 0) {
      await ImagenProducto.destroy({ where: { producto_id: id } });
      const imagenesData = imagenes.map(image => ({
        producto_id: id,
        url: image.url,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await ImagenProducto.bulkCreate(imagenesData);
    }

    // Obtener el producto actualizado con las imágenes
    const productoActualizado = await Producto.findByPk(id, {
      include: {
        model: ImagenProducto,
        as: 'imagenes',
      },
    });

    res.status(200).json(productoActualizado);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    if (error instanceof Sequelize.UniqueConstraintError) {
      res.status(400).json({ error: `Código de producto duplicado - ${error.message}` });
    } else {
      res.status(500).json({ error: `Error al actualizar el producto - ${error.message}` });
    }
  }
};

// Eliminar producto
exports.eliminarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await producto.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: `Error al eliminar el producto - ${error.message}` });
  }
};

// Búsqueda de productos por parámetro
exports.buscarProductos = async (req, res) => {
  const { nombre, categoria_id } = req.query;

  try {
    const where = {};
    if (nombre) where.nombre = nombre;
    if (categoria_id) where.categoria_id = categoria_id;

    const productos = await Producto.findAll({
      where,
      include: {
        model: ImagenProducto,
        as: 'imagenes',
      },
    });

    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al buscar productos:', error);
    res.status(500).json({ error: `Error al buscar productos - ${error.message}` });
  }
};