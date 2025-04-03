const { Categoria } = require('../models');

exports.crearCategoria = async (req, res) => {
  const { nombre } = req.body;

  try {
    const newCategoria = await Categoria.create({ nombre });
    res.status(201).json(newCategoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.modificarCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  try {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    await categoria.update({ nombre });
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    await categoria.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};