const Banner = require('../models/Banner');

exports.obtenerBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll();
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearBanner = async (req, res) => {
  const { url } = req.body;

  try {
    const newBanner = await Banner.create({ url });
    res.status(201).json(newBanner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.modificarBanner = async (req, res) => {
  const { id } = req.params;
  const { url } = req.body;

  try {
    const banner = await Banner.findByPk(id);
    if (!banner) {
      return res.status(404).json({ error: 'Banner no encontrado' });
    }

    await banner.update({ url });
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarBanner = async (req, res) => {
  const { id } = req.params;

  try {
    const banner = await Banner.findByPk(id);
    if (!banner) {
      return res.status(404).json({ error: 'Banner no encontrado' });
    }

    await banner.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};