const Banner = require('../models/Banner');
const Logo = require('../models/Logo');
const path = require('path');
const fs = require('fs');

// Funciones para los Banners
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los banners' });
  }
};

exports.createBanner = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const bannerPath = `/uploads/imagenes/pagina/banners/${req.file.filename}`;
    const banner = await Banner.create({ url: bannerPath });
    res.status(201).json(banner);
  } catch (error) {
    console.error('Error al subir el banner:', error);
    res.status(500).json({ message: 'Error al subir el banner' });
  }
};

exports.updateBanner = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const bannerPath = `/uploads/imagenes/pagina/banners/${req.file.filename}`;
    const banner = await Banner.findByIdAndUpdate(req.params.id, { url: bannerPath }, { new: true });
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.status(200).json(banner);
  } catch (error) {
    console.error('Error al actualizar el banner:', error);
    res.status(500).json({ message: 'Error al actualizar el banner' });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByPk(id);
    if (!banner) {
      return res.status(404).json({ error: 'Banner no encontrado' });
    }

    const filePath = ('/uploads/imagenes/pagina/banners', path.basename(banner.url));
    const fullPath = path.join(__dirname, '../', banner.url);
    fs.unlinkSync(fullPath);

    await banner.destroy();
    res.json({ message: 'Banner eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el banner' });
  }
};

// Funciones para el Logo
exports.getLogo = async (req, res) => {
  try {
    const logo = await Logo.findOne();
    res.json(logo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el logo' });
  }
};

exports.createOrUpdateLogo = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const logoPath = `/uploads/imagenes/pagina/logo/${req.file.filename}`;
    let logo = await Logo.findOne();
    if (logo) {
      logo.url = logoPath;
      await logo.save();
    } else {
      logo = await Logo.create({ url: logoPath });
    }
    res.status(201).json(logo);
  } catch (error) {
    console.error('Error al subir o actualizar el logo:', error);
    res.status(500).json({ message: 'Error al subir o actualizar el logo' });
  }
};
