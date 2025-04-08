const dotenv = require('dotenv');
dotenv.config();

const { ImagenProducto } = require('../models');
const { validationResult } = require('express-validator');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const uuid = require('uuid').v4;

// Configuración de AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Función para subir una nueva imagen de producto
exports.subirImagen = async (req, res) => {
  const { producto_id } = req.body;
  const { file } = req;
  console.log(req.body)
  if (!file) {
    console.error('=> No se ha subido ningún archivo');
    return res.status(400).json({ msg: 'No se ha subido ningún archivo' });
  }
  const fileName = `${uuid()}-${file.originalname}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `productos/${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/productos/${fileName}`;
    const nuevaImagen = await ImagenProducto.create({
      producto_id,
      url,
    });
    console.log("llego aca....")
    res.status(201).json(nuevaImagen);
  } catch (error) {
    console.error('=> Error al subir imagen:', error);
    res.status(500).json({ msg: 'Error al subir imagen', error });
  }
};

// Función para eliminar una imagen de producto
exports.eliminarImagen = async (req, res) => {
  const { id } = req.params;
  try {
    const imagen = await ImagenProducto.findByPk(id);
    if (!imagen) {
      return res.status(404).json({ msg: 'Imagen no encontrada' });
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imagen.url.split('.com/')[1], // Extraer la clave del objeto desde la URL
    };

    await s3Client.send(new DeleteObjectCommand(params));
    console.log('=> Archivo de la imagen eliminado de S3');

    await imagen.destroy();
    res.status(200).json({ msg: 'Imagen eliminada correctamente' });
  } catch (error) {
    console.error('=> Error al eliminar imagen:', error);
    res.status(500).json({ msg: 'Error al eliminar imagen', error });
  }
};