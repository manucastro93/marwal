const dotenv = require('dotenv');
dotenv.config();

const { ImagenProducto } = require('../models');
const { validationResult } = require('express-validator');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid').v4;

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `${uuid()}-${file.originalname}`);
    },
  }),
});

exports.subirImagen = (req, res) => {
  upload.single('file')(req, res, async (error) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const { producto_id } = req.body;

    try {
      const nuevaImagen = await ImagenProducto.create({
        producto_id,
        url: req.file.location,
      });

      res.status(201).json(nuevaImagen);
    } catch (error) {
      res.status(500).json({ msg: 'Error al subir imagen', error });
    }
  });
};

exports.eliminarImagen = async (req, res) => {
  const { id } = req.params;

  try {
    const imagen = await ImagenProducto.findByPk(id);
    if (!imagen) {
      return res.status(404).json({ msg: 'Imagen no encontrada' });
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imagen.url.split('/').pop(),
    };

    await s3Client.send(new DeleteObjectCommand(params));
    await imagen.destroy();
    res.status(200).json({ msg: 'Imagen eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar imagen', error });
  }
};