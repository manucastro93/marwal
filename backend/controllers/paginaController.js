const dotenv = require('dotenv');
dotenv.config();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Banner, Logo } = require('../models');
const { validationResult } = require('express-validator');
// Configuración de AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});
// Función para subir un nuevo logo
exports.subirLogo = async (req, res) => {
  const { nombre, usuario_id } = req.body;
  const { file } = req;
  if (!file) {
    console.error('=> No se ha subido ningún archivo');
    return res.status(400).json({ msg: 'No se ha subido ningún archivo' });
  }
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `logos/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/logos/${file.originalname}`;
    const nuevoLogo = await Logo.create({
      nombre,
      url,
      usuario_id,
    });
    res.status(201).json(nuevoLogo);
  } catch (error) {
    console.error('=> Error al subir logo:', error);
    res.status(500).json({ msg: 'Error al subir logo', error });
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

// Función para crear un nuevo banner
exports.crearBanner = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('=> Error de validación:', errors.array());
    return res.status(400).json({ errores: errors.array() });
  }
  const { nombre, posicion, estado, usuario_id } = req.body;
  const { file } = req;
  if (!file) {
    console.error('=> No se ha subido ningún archivo');
    return res.status(400).json({ msg: 'No se ha subido ningún archivo' });
  }
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `banners/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/banners/${file.originalname}`;
    const nuevoBanner = await Banner.create({
      nombre,
      url,
      posicion,
      estado,
      usuario_id,
    });

    res.status(201).json(nuevoBanner);
  } catch (error) {
    console.error('=> Error al crear banner:', error);
    res.status(500).json({ msg: 'Error al crear banner', error });
  }
};

// Función para obtener los banners activos
exports.buscarBannersActivos = async (req, res) => {
  try {
    const banners = await Banner.findAll({ where: { estado: 'activo' } });
    res.status(200).json(banners);
  } catch (error) {
    console.error('=> Error al buscar banners activos:', error);
    res.status(500).json({ msg: 'Error al buscar banners activos', error });
  }
};

// Función para eliminar un banner
exports.eliminarBanner = async (req, res) => {
  const { id } = req.params;
  try {
    const banner = await Banner.findByPk(id);
    if (!banner) {
      return res.status(404).json({ msg: 'Banner no encontrado' });
    }
    // Eliminar el archivo del banner en S3
    const deleteParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: banner.url.split('.com/')[1], // Extraer la clave del objeto desde la URL
    };
    await s3Client.send(new DeleteObjectCommand(deleteParams));
    console.log('=> Archivo del banner eliminado de S3');

    // Cambiar el estado del banner a inactivo en la base de datos
    banner.estado = 'inactivo';
    await banner.save();
    res.status(200).json({ msg: 'Banner eliminado (estado inactivo)' });
  } catch (error) {
    console.error('=> Error al eliminar banner:', error);
    res.status(500).json({ msg: 'Error al eliminar banner', error });
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

