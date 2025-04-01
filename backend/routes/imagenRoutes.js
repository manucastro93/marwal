const express = require('express');
const router = express.Router();
const { upload, uploadImage } = require('../controllers/imagenController');

// Ruta para subir imágenes
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;