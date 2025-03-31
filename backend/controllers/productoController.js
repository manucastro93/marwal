const Producto = require('../models/Producto');
const ImagenProducto = require('../models/ImagenProducto');

// Crear producto
exports.crearProducto = async (req, res) => {
  const { codigo, nombre, descripcion, precio, categoria_id, imagenes } = req.body;

  try {
    const newProducto = await Producto.create({
      codigo,
      nombre,
      descripcion,
      precio,
      categoria_id,
    });

    if (imagenes && imagenes.length > 0) {
      const imagenesData = imagenes.map(url => ({
        producto_id: newProducto.id,
        url,
      }));
      await ImagenProducto.bulkCreate(imagenesData);
    }

    res.status(201).json(newProducto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Modificar producto
exports.modificarProducto = async (req, res) => {
  const { id } = req.params;
  const { codigo, nombre, descripcion, precio, categoria_id, imagenes } = req.body;

  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await producto.update({
      codigo,
      nombre,
      descripcion,
      precio,
      categoria_id,
    });

    if (imagenes && imagenes.length > 0) {
      await ImagenProducto.destroy({ where: { producto_id: id } });
      const imagenesData = imagenes.map(url => ({
        producto_id: id,
        url,
      }));
      await ImagenProducto.bulkCreate(imagenesData);
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
};