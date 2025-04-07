const { Banner, Logo } = require('../models');
const { validationResult } = require('express-validator');

// Función para buscar todos los banners
exports.buscarBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll();
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar banners', error });
  }
};

// Función para crear un nuevo banner
exports.crearBanner = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const { nombre, url, posicion, estado, usuario_id } = req.body;

  try {
    const nuevoBanner = await Banner.create({
      nombre,
      url,
      posicion,
      estado,
      usuario_id,
    });

    res.status(201).json(nuevoBanner);
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear banner', error });
  }
};

// Función para eliminar (cambiar estado a inactivo) un banner
exports.eliminarBanner = async (req, res) => {
  const { id } = req.params;

  try {
    const banner = await Banner.findByPk(id);
    if (!banner) {
      return res.status(404).json({ msg: 'Banner no encontrado' });
    }

    banner.estado = 'inactivo';
    await banner.save();
    res.status(200).json({ msg: 'Banner eliminado (estado inactivo)' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar banner', error });
  }
};

// Función para buscar el logo de la página
exports.buscarLogo = async (req, res) => {
  try {
    const logo = await Logo.findOne();
    res.status(200).json(logo);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar logo', error });
  }
};